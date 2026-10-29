# Auditoria geral do CardBrazil

## Acesso à documentação

- Interface visual: `/swagger`
- Especificação OpenAPI JSON: `/api/swagger`
- A especificação também pode ser importada no Swagger Editor, Postman ou Insomnia.

## Pontos revisados

- Front-end: rotas do dashboard, navegação, estados de carregamento, vazio e erro.
- Back-end: rotas API, contratos de payload, respostas HTTP e parâmetros assíncronos do Next.js 16.
- Banco: queries parametrizadas, relacionamentos de Propostas e Beneficiários e operações CRUD.
- Autenticação: JWT, recuperação e alteração de senha, cookies e separação de dados por administradora.
- Documentação: inventário OpenAPI e tela interativa Swagger UI.
- Segurança de implantação: cabeçalhos HTTP de defesa em profundidade.

## Correções aplicadas nesta etapa

- Adicionados `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy` e `X-Frame-Options` no Next.js.
- Adicionado acesso direto à documentação no grupo Sistemas do menu.
- Mantida a especificação OpenAPI gerada pelo backend como fonte da documentação.

## Próxima etapa recomendada

Executar testes autenticados de cada módulo com dados do banco conectado e revisar permissões específicas por perfil. Endpoints de integração externa e rotinas financeiras devem ser validados também com seus serviços reais, pois não são simulados neste relatório.
