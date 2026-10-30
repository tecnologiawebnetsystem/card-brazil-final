import assert from "node:assert/strict"
import test from "node:test"

function createPaymentHarness({ administratorId = 1, existing = [], balance = 100, authorized = true, fail = null } = {}) {
  const payments = [...existing]
  let currentBalance = balance
  const calls = { transactions: 0, audits: 0 }

  return {
    calls,
    payments,
    async post({ key, value, paymentMethod = "pix", targetAdministratorId = administratorId, auditFails = false }) {
      if (!authorized) return { status: 403, body: { error: "Sem permissão" } }
      if (targetAdministratorId !== administratorId) return { status: 404, body: { error: "Não encontrado" } }

      const previous = payments.find((payment) => payment.administratorId === administratorId && payment.key === key)
      if (previous) {
        if (previous.value !== value || previous.paymentMethod !== paymentMethod) {
          return { status: 409, body: { error: "Idempotency-Key já utilizada com parâmetros incompatíveis" } }
        }
        return { status: 200, body: { data: previous, idempotent: true } }
      }

      if (fail === "before-confirmation") return { status: 500, body: { error: "Erro ao registrar pagamento" } }
      if (value <= 0 || value > currentBalance) return { status: 422, body: { error: "Pagamento superior ao saldo" } }

      calls.transactions += 1
      if (fail === "payment-write" || fail === "balance-write") return { status: 500, body: { error: "Erro ao registrar pagamento" } }

      const payment = { id: payments.length + 1, administratorId, key, value, paymentMethod }
      payments.push(payment)
      currentBalance = Number((currentBalance - value).toFixed(2))

      calls.audits += 1
      if (auditFails) {
        return { status: 500, body: { error: "Pagamento confirmado; auditoria pendente" }, financialState: { payments: payments.length, balance: currentBalance } }
      }
      return { status: 201, body: { data: payment }, financialState: { payments: payments.length, balance: currentBalance } }
    },
  }
}

test("repetição sequencial retorna o mesmo pagamento sem criar segundo registro", async () => {
  const harness = createPaymentHarness({ balance: 100 })
  const first = await harness.post({ key: "k-1", value: 40 })
  const second = await harness.post({ key: "k-1", value: 40 })

  assert.equal(first.status, 201)
  assert.equal(second.status, 200)
  assert.equal(second.body.idempotent, true)
  assert.equal(harness.payments.length, 1)
  assert.equal(harness.calls.transactions, 1)
})

test("mesma chave com valor, parcela ou meio diferentes retorna conflito", async () => {
  const harness = createPaymentHarness({ balance: 100 })
  await harness.post({ key: "k-1", value: 40, paymentMethod: "pix" })

  for (const input of [
    { key: "k-1", value: 41, paymentMethod: "pix" },
    { key: "k-1", value: 40, paymentMethod: "boleto" },
  ]) {
    const result = await harness.post(input)
    assert.equal(result.status, 409)
  }
  assert.equal(harness.payments.length, 1)
})

test("a mesma chave permanece isolada por administradora", async () => {
  const first = createPaymentHarness({ administratorId: 1, balance: 100 })
  const second = createPaymentHarness({ administratorId: 2, balance: 100 })

  assert.equal((await first.post({ key: "shared", value: 25 })).status, 201)
  assert.equal((await second.post({ key: "shared", value: 25 })).status, 201)
  assert.equal(first.payments.length, 1)
  assert.equal(second.payments.length, 1)
})

test("pagamento parcial e pagamento exato consomem somente o saldo", async () => {
  const harness = createPaymentHarness({ balance: 100 })
  assert.equal((await harness.post({ key: "partial", value: 35 })).status, 201)
  assert.equal((await harness.post({ key: "final", value: 65 })).status, 201)
  assert.equal((await harness.post({ key: "excess", value: 1 })).status, 422)
  assert.equal(harness.calls.transactions, 2)
  assert.equal(harness.payments.length, 2)
})

test("autorização negada não cria efeito financeiro", async () => {
  const harness = createPaymentHarness({ authorized: false, balance: 100 })
  const result = await harness.post({ key: "denied", value: 20 })

  assert.equal(result.status, 403)
  assert.equal(harness.payments.length, 0)
  assert.equal(harness.calls.transactions, 0)
})

test("falha antes da confirmação não cria pagamento", async () => {
  const harness = createPaymentHarness({ fail: "before-confirmation", balance: 100 })
  const result = await harness.post({ key: "failed", value: 20 })

  assert.equal(result.status, 500)
  assert.equal(harness.payments.length, 0)
})

test("falha de gravação ou atualização não cria efeito no harness transacional", async () => {
  for (const fail of ["payment-write", "balance-write"]) {
    const harness = createPaymentHarness({ fail, balance: 100 })
    const result = await harness.post({ key: fail, value: 20 })
    assert.equal(result.status, 500)
    assert.equal(harness.payments.length, 0)
    assert.equal(harness.calls.audits, 0)
  }
})

test("falha de auditoria externa é explicitamente não atômica", async () => {
  const harness = createPaymentHarness({ balance: 100 })
  const result = await harness.post({ key: "audit-fails", value: 20, auditFails: true })

  assert.equal(result.status, 500)
  assert.deepEqual(result.financialState, { payments: 1, balance: 80 })
  assert.equal(harness.payments.length, 1)
  assert.equal(harness.calls.transactions, 1)
  assert.equal(harness.calls.audits, 1)
})

test("resposta perdida seguida de repetição não cria segundo pagamento", async () => {
  const harness = createPaymentHarness({ balance: 100 })
  const original = await harness.post({ key: "timeout-safe", value: 30 })
  assert.equal(original.status, 201)

  const retry = await harness.post({ key: "timeout-safe", value: 30 })
  assert.equal(retry.status, 200)
  assert.equal(retry.body.idempotent, true)
  assert.equal(harness.payments.length, 1)
})

// Estes testes exercitam um harness determinístico de dependências; não provam concorrência,
// rollback do Neon/PostgreSQL nem a existência de constraints no banco real.
