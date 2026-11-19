#!/usr/bin/env bash
set -euo pipefail

if ! command -v docker >/dev/null 2>&1 || ! docker info >/dev/null 2>&1; then
  printf '%s\n' "Docker não está disponível; nenhum teste PostgreSQL foi executado." >&2
  exit 2
fi

container="card-brazil-test-$$"
password="cb-test-$(date +%s)-$$"
cleanup() { docker rm -f "$container" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker run --rm --detach --name "$container" \
  --publish 127.0.0.1::5432 \
  --env POSTGRES_DB=card_brazil_test \
  --env POSTGRES_USER=postgres \
  --env POSTGRES_PASSWORD="$password" \
  postgres:16-alpine >/dev/null

port=""
for attempt in $(seq 1 60); do
  mapping="$(docker port "$container" 5432/tcp 2>/dev/null || true)"
  if [[ "$mapping" == 127.0.0.1:* ]]; then
    port="${mapping##*:}"
    if docker exec "$container" pg_isready -U postgres -d card_brazil_test >/dev/null 2>&1; then break; fi
  fi
  sleep 1
done

if [[ -z "$port" ]]; then
  printf '%s\n' "PostgreSQL efêmero não iniciou em loopback." >&2
  exit 2
fi

apply_sql() {
  local file="$1"
  docker exec -i --env PGPASSWORD="$password" "$container" \
    psql --no-psqlrc --set ON_ERROR_STOP=1 --username postgres --dbname card_brazil_test < "$file"
}

for file in \
  sql/banco-dados_DDL_00_administradoras.sql \
  sql/banco-dados_DDL_01_usuarios_autenticacao.sql \
  sql/banco-dados_DDL_02_pessoas_enderecos_bancarios.sql \
  sql/banco-dados_DDL_03_operadoras_estipulantes.sql \
  sql/banco-dados_DDL_04_corretores_agenciadores.sql \
  sql/banco-dados_DDL_05_planos_produtos.sql \
  sql/banco-dados_DDL_06_financeiro_auditoria.sql \
  sql/banco-dados_DDL_07_propostas.sql \
  sql/banco-dados_DDL_08_tabelas_gerais.sql \
  sql/banco-dados_DDL_09_modulo_financeiro.sql \
  sql/banco-dados_DDL_10_faturamento_bancario.sql \
  sql/banco-dados_migrations_001_cadastros_postgresql.sql \
  sql/banco-dados_migrations_002_saneamento_cadastros.sql \
  sql/banco-dados_migrations_005_integridade_cobranca_financeira.sql \
  sql/banco-dados_migrations_006_conciliacao_inadimplencia.sql \
  sql/banco-dados_migrations_007_integracao_fluxo_principal.sql; do
  apply_sql "$file"
done

export CARD_BRAZIL_TEST_DB=1
export TEST_DATABASE_URL="postgres://postgres:${password}@127.0.0.1:${port}/card_brazil_test"
export DATABASE_URL=""
export NODE_ENV=test
corepack pnpm exec node --experimental-strip-types --test tests/integration/postgres-driver.test.mjs
