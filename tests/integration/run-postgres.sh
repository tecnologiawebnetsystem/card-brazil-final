#!/usr/bin/env bash
set -euo pipefail

run_tests() {
  export CARD_BRAZIL_TEST_DB=1
  export DATABASE_URL=""
  node tests/integration/prepare-postgres.mjs
  corepack pnpm exec node --experimental-strip-types --test tests/integration/*.test.mjs
}

if [[ "${CARD_BRAZIL_CI_POSTGRES:-}" == "1" ]]; then
  if [[ "${GITHUB_ACTIONS:-}" != "true" ]]; then
    printf '%s\n' "O serviço PostgreSQL de CI só é aceito no GitHub Actions." >&2
    exit 2
  fi
  if [[ -n "${DATABASE_URL:-}" ]]; then
    printf '%s\n' "DATABASE_URL operacional está proibida no harness de CI." >&2
    exit 2
  fi
  for name in DATABASE_URL_UNPOOLED NEON_DATABASE_URL POSTGRES_URL POSTGRES_URL_NON_POOLING POSTGRES_PRISMA_URL; do
    if [[ -n "${!name:-}" ]]; then
      printf 'Variável operacional proibida: %s\n' "$name" >&2
      exit 2
    fi
  done
  run_tests
  exit 0
fi

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
  --env POSTGRES_USER=card_brazil_ci \
  --env POSTGRES_PASSWORD="$password" \
  postgres:16-alpine >/dev/null

port=""
for attempt in $(seq 1 60); do
  mapping="$(docker port "$container" 5432/tcp 2>/dev/null || true)"
  if [[ "$mapping" == 127.0.0.1:* ]]; then
    port="${mapping##*:}"
    if docker exec "$container" pg_isready -U card_brazil_ci -d card_brazil_test >/dev/null 2>&1; then break; fi
  fi
  sleep 1
done

if [[ -z "$port" ]]; then
  printf '%s\n' "PostgreSQL efêmero não iniciou em loopback." >&2
  exit 2
fi

export CARD_BRAZIL_TEST_DB=1
export TEST_DATABASE_URL="postgresql://card_brazil_ci:${password}@127.0.0.1:${port}/card_brazil_test"
export DATABASE_URL=""
export NODE_ENV=test
run_tests
