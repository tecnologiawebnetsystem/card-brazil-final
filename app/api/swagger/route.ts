import { NextResponse } from "next/server"

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Talent Health CRM API",
    version: "1.0.0",
    description: "API REST completa do sistema Talent Health CRM para gestão de seguros de saúde corporativo",
    contact: {
      name: "Suporte Talent Health",
      email: "suporte@talenthealth.com.br",
    },
    license: {
      name: "Proprietário",
      url: "https://talenthealth.com.br/licenca",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      description: "Servidor de Desenvolvimento",
    },
    {
      url: "https://talenthealth.vercel.app",
      description: "Servidor de Produção",
    },
  ],
  tags: [
    {
      name: "Autenticação",
      description: "Endpoints de autenticação e gerenciamento de sessão",
    },
    {
      name: "Pessoas",
      description: "CRUD de pessoas físicas e jurídicas",
    },
    {
      name: "Endereços",
      description: "CRUD de endereços de pessoas",
    },
    {
      name: "Dados Bancários",
      description: "CRUD de contas bancárias de pessoas",
    },
    {
      name: "Operadoras",
      description: "CRUD de operadoras de saúde",
    },
    {
      name: "Administradoras",
      description: "CRUD de administradoras",
    },
    {
      name: "Estipulantes",
      description: "CRUD de estipulantes",
    },
    {
      name: "Corretores",
      description: "CRUD de corretores",
    },
    {
      name: "Agenciadores",
      description: "CRUD de agenciadores",
    },
    {
      name: "Planos",
      description: "CRUD de planos de saúde",
    },
    {
      name: "Produtos",
      description: "CRUD de produtos",
    },
    {
      name: "Beneficiários",
      description: "CRUD de beneficiários",
    },
    {
      name: "Contratos",
      description: "CRUD de contratos",
    },
    {
      name: "Propostas",
      description: "CRUD de propostas e fluxo de aprovação",
    },
    {
      name: "Bancos",
      description: "CRUD de bancos e integração com Bacen",
    },
    {
      name: "Moedas",
      description: "CRUD de moedas e atualização de cotações",
    },
    {
      name: "Feriados",
      description: "CRUD de feriados nacionais, estaduais e municipais",
    },
    {
      name: "CEP",
      description: "Busca de endereços por CEP via ViaCEP",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT obtido através do endpoint de login",
      },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "admin@talenthealth.com.br",
            description: "Email do usuário",
          },
          senha: {
            type: "string",
            format: "password",
            example: "admin123",
            description: "Senha do usuário",
          },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          message: {
            type: "string",
            example: "Login realizado com sucesso",
          },
          data: {
            type: "object",
            properties: {
              token: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                description: "Token JWT para autenticação",
              },
              refreshToken: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                description: "Token para renovação",
              },
              usuario: {
                $ref: "#/components/schemas/Usuario",
              },
            },
          },
        },
      },
      Usuario: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          email: {
            type: "string",
            format: "email",
            example: "admin@talenthealth.com.br",
          },
          ativo: {
            type: "boolean",
            example: true,
          },
          email_verificado: {
            type: "boolean",
            example: true,
          },
          created_at: {
            type: "string",
            format: "date-time",
            example: "2024-01-15T10:30:00Z",
          },
          perfil: {
            $ref: "#/components/schemas/PerfilUsuario",
          },
          roles: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Role",
            },
          },
        },
      },
      PerfilUsuario: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          nome_completo: {
            type: "string",
            example: "Administrador do Sistema",
          },
          nome_exibicao: {
            type: "string",
            example: "Admin",
          },
          telefone: {
            type: "string",
            example: "(11) 98765-4321",
          },
          cargo: {
            type: "string",
            example: "Administrador",
          },
          departamento: {
            type: "string",
            example: "TI",
          },
          avatar_url: {
            type: "string",
            format: "uri",
            example: "https://avatar.url/admin.jpg",
          },
        },
      },
      Role: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          nome: {
            type: "string",
            example: "admin",
            enum: ["admin", "gestor", "operador", "usuario"],
          },
          descricao: {
            type: "string",
            example: "Administrador do sistema",
          },
          permissoes: {
            type: "array",
            items: {
              type: "string",
            },
            example: ["usuarios.criar", "usuarios.editar", "usuarios.excluir"],
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Erro ao processar requisição",
          },
          error: {
            type: "string",
            example: "Detalhes do erro",
          },
        },
      },
      Pessoa: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          tipo_pessoa: { type: "string", enum: ["fisica", "juridica"], example: "fisica" },
          nome: { type: "string", example: "João Silva" },
          cpf: { type: "string", example: "123.456.789-00" },
          cnpj: { type: "string", example: "12.345.678/0001-90" },
          rg: { type: "string", example: "12.345.678-9" },
          inscricao_estadual: { type: "string", example: "123.456.789.012" },
          data_nascimento: { type: "string", format: "date", example: "1990-01-15" },
          email: { type: "string", format: "email", example: "joao@email.com" },
          telefone: { type: "string", example: "(11) 98765-4321" },
          status: { type: "string", enum: ["ativo", "inativo"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Endereco: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          pessoa_id: { type: "integer", example: 1 },
          tipo_endereco: { type: "string", example: "residencial" },
          cep: { type: "string", example: "01310-100" },
          logradouro: { type: "string", example: "Avenida Paulista" },
          numero: { type: "string", example: "1000" },
          complemento: { type: "string", example: "Apto 101" },
          bairro: { type: "string", example: "Bela Vista" },
          cidade: { type: "string", example: "São Paulo" },
          estado: { type: "string", example: "SP" },
          email: { type: "string", format: "email", example: "contato@email.com" },
          principal: { type: "boolean", example: true },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      DadosBancarios: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          pessoa_id: { type: "integer", example: 1 },
          banco: { type: "string", example: "001" },
          agencia: { type: "string", example: "1234-5" },
          tipo_conta: { type: "string", enum: ["corrente", "poupanca", "salario"], example: "corrente" },
          conta: { type: "string", example: "12345-6" },
          digito: { type: "string", example: "7" },
          principal: { type: "boolean", example: true },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Operadora: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          pessoa_id: { type: "integer", example: 1 },
          registro_ans: { type: "string", example: "123456" },
          tipo_operadora: { type: "string", example: "Medicina de Grupo" },
          status: { type: "string", enum: ["ativo", "inativo"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Administradora: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nome: { type: "string", example: "Talent Health" },
          cnpj: { type: "string", example: "12.345.678/0001-90" },
          razao_social: { type: "string", example: "Talent Health Administradora Ltda" },
          email: { type: "string", format: "email", example: "contato@talenthealth.com.br" },
          telefone: { type: "string", example: "(11) 3000-0000" },
          status: { type: "string", enum: ["ativo", "inativo"], example: "ativo" },
        },
      },
      Estipulante: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          pessoa_id: { type: "integer", example: 1 },
          tipo_estipulante: { type: "string", example: "Empresa" },
          status: { type: "string", enum: ["ativo", "inativo"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Corretor: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          pessoa_id: { type: "integer", example: 1 },
          registro_susep: { type: "string", example: "123456789" },
          comissao_padrao: { type: "number", format: "decimal", example: 5.5 },
          status: { type: "string", enum: ["ativo", "inativo"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Agenciador: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          pessoa_id: { type: "integer", example: 1 },
          comissao_padrao: { type: "number", format: "decimal", example: 3.0 },
          status: { type: "string", enum: ["ativo", "inativo"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Plano: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          operadora_id: { type: "integer", example: 1 },
          nome: { type: "string", example: "Plano Saúde Total" },
          codigo_ans: { type: "string", example: "987654" },
          tipo_plano: { type: "string", example: "Coletivo Empresarial" },
          cobertura: { type: "string", example: "Nacional" },
          acomodacao: { type: "string", example: "Apartamento" },
          status: { type: "string", enum: ["ativo", "inativo"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Produto: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          plano_id: { type: "integer", example: 1 },
          nome: { type: "string", example: "Produto Premium" },
          descricao: { type: "string", example: "Cobertura completa com odontologia" },
          valor_base: { type: "number", format: "decimal", example: 450.0 },
          status: { type: "string", enum: ["ativo", "inativo"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Beneficiario: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          pessoa_id: { type: "integer", example: 1 },
          contrato_id: { type: "integer", example: 1 },
          tipo_beneficiario: { type: "string", enum: ["titular", "dependente"], example: "titular" },
          numero_carteirinha: { type: "string", example: "123456789012345" },
          data_inclusao: { type: "string", format: "date", example: "2024-01-15" },
          status: { type: "string", enum: ["ativo", "inativo", "suspenso"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Contrato: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          estipulante_id: { type: "integer", example: 1 },
          operadora_id: { type: "integer", example: 1 },
          plano_id: { type: "integer", example: 1 },
          numero_contrato: { type: "string", example: "CONT-2024-001" },
          data_inicio: { type: "string", format: "date", example: "2024-01-01" },
          data_fim: { type: "string", format: "date", example: "2024-12-31" },
          valor_total: { type: "number", format: "decimal", example: 15000.0 },
          status: { type: "string", enum: ["ativo", "inativo", "cancelado"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Proposta: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          numero_proposta: { type: "string", example: "PROP-2024-001" },
          estipulante_id: { type: "integer", example: 1 },
          operadora_id: { type: "integer", example: 1 },
          plano_id: { type: "integer", example: 1 },
          corretor_id: { type: "integer", example: 1 },
          tipo_contratacao: { type: "string", example: "Novo" },
          quantidade_vidas: { type: "integer", example: 50 },
          valor_total: { type: "number", format: "decimal", example: 25000.0 },
          data_proposta: { type: "string", format: "date", example: "2024-01-15" },
          status: { type: "string", enum: ["pendente", "em_analise", "aprovada", "rejeitada"], example: "pendente" },
          observacoes: { type: "string", example: "Proposta para empresa de tecnologia" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Banco: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          codigo: { type: "string", example: "001" },
          nome: { type: "string", example: "Banco do Brasil" },
          nome_completo: { type: "string", example: "Banco do Brasil S.A." },
          ispb: { type: "string", example: "00000000" },
          status: { type: "string", enum: ["ativo", "inativo"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Moeda: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          codigo: { type: "string", example: "USD" },
          nome: { type: "string", example: "Dólar Americano" },
          simbolo: { type: "string", example: "$" },
          cotacao_compra: { type: "number", format: "decimal", example: 4.95 },
          cotacao_venda: { type: "number", format: "decimal", example: 5.05 },
          variacao: { type: "number", format: "decimal", example: 0.5 },
          ultima_atualizacao: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z" },
          status: { type: "string", enum: ["ativo", "inativo"], example: "ativo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      Feriado: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nome: { type: "string", example: "Ano Novo" },
          data: { type: "string", format: "date", example: "2024-01-01" },
          tipo: { type: "string", enum: ["nacional", "estadual", "municipal"], example: "nacional" },
          tipo_feriado: { type: "string", enum: ["fixo", "movel"], example: "fixo" },
          uf: { type: "string", example: "SP" },
          cidade: { type: "string", example: "São Paulo" },
          id_administradora: { type: "integer", example: 1 },
        },
      },
      CEPResponse: {
        type: "object",
        properties: {
          cep: { type: "string", example: "01310-100" },
          logradouro: { type: "string", example: "Avenida Paulista" },
          complemento: { type: "string", example: "" },
          bairro: { type: "string", example: "Bela Vista" },
          localidade: { type: "string", example: "São Paulo" },
          uf: { type: "string", example: "SP" },
          ibge: { type: "string", example: "3550308" },
          gia: { type: "string", example: "1004" },
          ddd: { type: "string", example: "11" },
          siafi: { type: "string", example: "7107" },
        },
      },
    },
  },
  paths: {
    "/api/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Realizar login no sistema",
        description: "Autentica um usuário e retorna um token JWT para acesso às APIs protegidas",
        operationId: "login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@talenthealth.com.br" },
                  password: { type: "string", format: "password", example: "admin123" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login realizado com sucesso" },
          "401": { description: "Credenciais inválidas" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Autenticação"],
        summary: "Realizar logout do sistema",
        description: "Invalida o token JWT atual e encerra a sessão do usuário",
        operationId: "logout",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Logout realizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      example: true,
                    },
                    message: {
                      type: "string",
                      example: "Logout realizado com sucesso",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Token de autenticação inválido ou ausente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string", example: "Não autorizado" },
                    error: { type: "string", example: "Token inválido ou expirado" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/pessoas": {
      get: {
        tags: ["Pessoas"],
        summary: "Listar todas as pessoas",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "tipo_pessoa", in: "query", schema: { type: "string", enum: ["fisica", "juridica"] } },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo"] } },
        ],
        responses: {
          "200": {
            description: "Lista de pessoas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Pessoa" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Pessoas"],
        summary: "Criar nova pessoa",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Pessoa" },
            },
          },
        },
        responses: {
          "201": { description: "Pessoa criada com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/pessoas/{id}": {
      get: {
        tags: ["Pessoas"],
        summary: "Buscar pessoa por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Pessoa encontrada" },
          "404": { description: "Pessoa não encontrada" },
        },
      },
      put: {
        tags: ["Pessoas"],
        summary: "Atualizar pessoa",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Pessoa" } } },
        },
        responses: {
          "200": { description: "Pessoa atualizada" },
          "404": { description: "Pessoa não encontrada" },
        },
      },
      delete: {
        tags: ["Pessoas"],
        summary: "Excluir pessoa",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Pessoa excluída" },
          "404": { description: "Pessoa não encontrada" },
        },
      },
    },
    "/api/enderecos": {
      get: {
        tags: ["Endereços"],
        summary: "Listar endereços",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "pessoa_id", in: "query", schema: { type: "integer" } },
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
        ],
        responses: {
          "200": {
            description: "Lista de endereços",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Endereco" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Endereços"],
        summary: "Criar novo endereço",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Endereco" } } },
        },
        responses: {
          "201": { description: "Endereço criado" },
        },
      },
    },
    "/api/enderecos/{id}": {
      put: {
        tags: ["Endereços"],
        summary: "Atualizar endereço",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Endereco" } } },
        },
        responses: {
          "200": { description: "Endereço atualizado" },
        },
      },
      delete: {
        tags: ["Endereços"],
        summary: "Excluir endereço",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Endereço excluído" },
        },
      },
    },
    "/api/dados-bancarios": {
      get: {
        tags: ["Dados Bancários"],
        summary: "Listar contas bancárias",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "pessoa_id", in: "query", schema: { type: "integer" } },
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
        ],
        responses: {
          "200": {
            description: "Lista de contas bancárias",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/DadosBancarios" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Dados Bancários"],
        summary: "Criar nova conta bancária",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/DadosBancarios" } } },
        },
        responses: {
          "201": { description: "Conta bancária criada" },
        },
      },
    },
    "/api/dados-bancarios/{id}": {
      put: {
        tags: ["Dados Bancários"],
        summary: "Atualizar conta bancária",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/DadosBancarios" } } },
        },
        responses: {
          "200": { description: "Conta bancária atualizada" },
        },
      },
      delete: {
        tags: ["Dados Bancários"],
        summary: "Excluir conta bancária",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Conta bancária excluída" },
        },
      },
    },
    "/api/operadoras": {
      get: {
        tags: ["Operadoras"],
        summary: "Listar todas as operadoras",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo"] } },
        ],
        responses: {
          "200": {
            description: "Lista de operadoras",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Operadora" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Operadoras"],
        summary: "Criar nova operadora",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Operadora" } } },
        },
        responses: {
          "201": { description: "Operadora criada com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/operadoras/{id}": {
      get: {
        tags: ["Operadoras"],
        summary: "Buscar operadora por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Operadora encontrada" },
          "404": { description: "Operadora não encontrada" },
        },
      },
      put: {
        tags: ["Operadoras"],
        summary: "Atualizar operadora",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Operadora" } } },
        },
        responses: {
          "200": { description: "Operadora atualizada" },
          "404": { description: "Operadora não encontrada" },
        },
      },
      delete: {
        tags: ["Operadoras"],
        summary: "Excluir operadora",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Operadora excluída" },
          "404": { description: "Operadora não encontrada" },
        },
      },
    },
    "/api/administradoras": {
      get: {
        tags: ["Administradoras"],
        summary: "Listar todas as administradoras",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Lista de administradoras",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Administradora" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Administradoras"],
        summary: "Criar nova administradora",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Administradora" } } },
        },
        responses: {
          "201": { description: "Administradora criada com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/administradoras/{id}": {
      get: {
        tags: ["Administradoras"],
        summary: "Buscar administradora por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Administradora encontrada" },
          "404": { description: "Administradora não encontrada" },
        },
      },
      put: {
        tags: ["Administradoras"],
        summary: "Atualizar administradora",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Administradora" } } },
        },
        responses: {
          "200": { description: "Administradora atualizada" },
          "404": { description: "Administradora não encontrada" },
        },
      },
      delete: {
        tags: ["Administradoras"],
        summary: "Excluir administradora",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Administradora excluída" },
          "404": { description: "Administradora não encontrada" },
        },
      },
    },
    "/api/estipulantes": {
      get: {
        tags: ["Estipulantes"],
        summary: "Listar todos os estipulantes",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo"] } },
        ],
        responses: {
          "200": {
            description: "Lista de estipulantes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Estipulante" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Estipulantes"],
        summary: "Criar novo estipulante",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Estipulante" } } },
        },
        responses: {
          "201": { description: "Estipulante criado com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/estipulantes/{id}": {
      get: {
        tags: ["Estipulantes"],
        summary: "Buscar estipulante por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Estipulante encontrado" },
          "404": { description: "Estipulante não encontrado" },
        },
      },
      put: {
        tags: ["Estipulantes"],
        summary: "Atualizar estipulante",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Estipulante" } } },
        },
        responses: {
          "200": { description: "Estipulante atualizado" },
          "404": { description: "Estipulante não encontrado" },
        },
      },
      delete: {
        tags: ["Estipulantes"],
        summary: "Excluir estipulante",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Estipulante excluído" },
          "404": { description: "Estipulante não encontrado" },
        },
      },
    },
    "/api/corretores": {
      get: {
        tags: ["Corretores"],
        summary: "Listar todos os corretores",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo"] } },
        ],
        responses: {
          "200": {
            description: "Lista de corretores",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Corretor" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Corretores"],
        summary: "Criar novo corretor",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Corretor" } } },
        },
        responses: {
          "201": { description: "Corretor criado com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/corretores/{id}": {
      get: {
        tags: ["Corretores"],
        summary: "Buscar corretor por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Corretor encontrado" },
          "404": { description: "Corretor não encontrado" },
        },
      },
      put: {
        tags: ["Corretores"],
        summary: "Atualizar corretor",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Corretor" } } },
        },
        responses: {
          "200": { description: "Corretor atualizado" },
          "404": { description: "Corretor não encontrado" },
        },
      },
      delete: {
        tags: ["Corretores"],
        summary: "Excluir corretor",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Corretor excluído" },
          "404": { description: "Corretor não encontrado" },
        },
      },
    },
    "/api/agenciadores": {
      get: {
        tags: ["Agenciadores"],
        summary: "Listar todos os agenciadores",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo"] } },
        ],
        responses: {
          "200": {
            description: "Lista de agenciadores",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Agenciador" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Agenciadores"],
        summary: "Criar novo agenciador",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Agenciador" } } },
        },
        responses: {
          "201": { description: "Agenciador criado com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/agenciadores/{id}": {
      get: {
        tags: ["Agenciadores"],
        summary: "Buscar agenciador por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Agenciador encontrado" },
          "404": { description: "Agenciador não encontrado" },
        },
      },
      put: {
        tags: ["Agenciadores"],
        summary: "Atualizar agenciador",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Agenciador" } } },
        },
        responses: {
          "200": { description: "Agenciador atualizado" },
          "404": { description: "Agenciador não encontrado" },
        },
      },
      delete: {
        tags: ["Agenciadores"],
        summary: "Excluir agenciador",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Agenciador excluído" },
          "404": { description: "Agenciador não encontrado" },
        },
      },
    },
    "/api/planos": {
      get: {
        tags: ["Planos"],
        summary: "Listar todos os planos",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "operadora_id", in: "query", schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo"] } },
        ],
        responses: {
          "200": {
            description: "Lista de planos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Plano" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Planos"],
        summary: "Criar novo plano",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Plano" } } },
        },
        responses: {
          "201": { description: "Plano criado com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/planos/{id}": {
      get: {
        tags: ["Planos"],
        summary: "Buscar plano por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Plano encontrado" },
          "404": { description: "Plano não encontrado" },
        },
      },
      put: {
        tags: ["Planos"],
        summary: "Atualizar plano",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Plano" } } },
        },
        responses: {
          "200": { description: "Plano atualizado" },
          "404": { description: "Plano não encontrado" },
        },
      },
      delete: {
        tags: ["Planos"],
        summary: "Excluir plano",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Plano excluído" },
          "404": { description: "Plano não encontrado" },
        },
      },
    },
    "/api/produtos": {
      get: {
        tags: ["Produtos"],
        summary: "Listar todos os produtos",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "plano_id", in: "query", schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo"] } },
        ],
        responses: {
          "200": {
            description: "Lista de produtos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Produto" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Produtos"],
        summary: "Criar novo produto",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Produto" } } },
        },
        responses: {
          "201": { description: "Produto criado com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/produtos/{id}": {
      get: {
        tags: ["Produtos"],
        summary: "Buscar produto por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Produto encontrado" },
          "404": { description: "Produto não encontrado" },
        },
      },
      put: {
        tags: ["Produtos"],
        summary: "Atualizar produto",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Produto" } } },
        },
        responses: {
          "200": { description: "Produto atualizado" },
          "404": { description: "Produto não encontrado" },
        },
      },
      delete: {
        tags: ["Produtos"],
        summary: "Excluir produto",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Produto excluído" },
          "404": { description: "Produto não encontrado" },
        },
      },
    },
    "/api/beneficiarios": {
      get: {
        tags: ["Beneficiários"],
        summary: "Listar todos os beneficiários",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "contrato_id", in: "query", schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo", "suspenso"] } },
        ],
        responses: {
          "200": {
            description: "Lista de beneficiários",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Beneficiario" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Beneficiários"],
        summary: "Criar novo beneficiário",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Beneficiario" } } },
        },
        responses: {
          "201": { description: "Beneficiário criado com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/beneficiarios/{id}": {
      get: {
        tags: ["Beneficiários"],
        summary: "Buscar beneficiário por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Beneficiário encontrado" },
          "404": { description: "Beneficiário não encontrado" },
        },
      },
      put: {
        tags: ["Beneficiários"],
        summary: "Atualizar beneficiário",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Beneficiario" } } },
        },
        responses: {
          "200": { description: "Beneficiário atualizado" },
          "404": { description: "Beneficiário não encontrado" },
        },
      },
      delete: {
        tags: ["Beneficiários"],
        summary: "Excluir beneficiário",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Beneficiário excluído" },
          "404": { description: "Beneficiário não encontrado" },
        },
      },
    },
    "/api/contratos": {
      get: {
        tags: ["Contratos"],
        summary: "Listar todos os contratos",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "estipulante_id", in: "query", schema: { type: "integer" } },
          { name: "operadora_id", in: "query", schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo", "cancelado"] } },
        ],
        responses: {
          "200": {
            description: "Lista de contratos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Contrato" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Contratos"],
        summary: "Criar novo contrato",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Contrato" } } },
        },
        responses: {
          "201": { description: "Contrato criado com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/contratos/{id}": {
      get: {
        tags: ["Contratos"],
        summary: "Buscar contrato por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Contrato encontrado" },
          "404": { description: "Contrato não encontrado" },
        },
      },
      put: {
        tags: ["Contratos"],
        summary: "Atualizar contrato",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Contrato" } } },
        },
        responses: {
          "200": { description: "Contrato atualizado" },
          "404": { description: "Contrato não encontrado" },
        },
      },
      delete: {
        tags: ["Contratos"],
        summary: "Excluir contrato",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Contrato excluído" },
          "404": { description: "Contrato não encontrado" },
        },
      },
    },
    "/api/propostas": {
      get: {
        tags: ["Propostas"],
        summary: "Listar todas as propostas",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          {
            name: "status",
            in: "query",
            schema: { type: "string", enum: ["pendente", "em_analise", "aprovada", "rejeitada"] },
          },
        ],
        responses: {
          "200": {
            description: "Lista de propostas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Proposta" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Propostas"],
        summary: "Criar nova proposta",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Proposta" } } },
        },
        responses: {
          "201": { description: "Proposta criada com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/propostas/{id}": {
      get: {
        tags: ["Propostas"],
        summary: "Buscar proposta por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Proposta encontrada" },
          "404": { description: "Proposta não encontrada" },
        },
      },
      put: {
        tags: ["Propostas"],
        summary: "Atualizar proposta",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Proposta" } } },
        },
        responses: {
          "200": { description: "Proposta atualizada" },
          "404": { description: "Proposta não encontrada" },
        },
      },
      delete: {
        tags: ["Propostas"],
        summary: "Excluir proposta",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Proposta excluída" },
          "404": { description: "Proposta não encontrada" },
        },
      },
    },
    "/api/bancos": {
      get: {
        tags: ["Bancos"],
        summary: "Listar todos os bancos",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo"] } },
        ],
        responses: {
          "200": {
            description: "Lista de bancos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Banco" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Bancos"],
        summary: "Criar novo banco",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Banco" } } },
        },
        responses: {
          "201": { description: "Banco criado com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/bancos/{id}": {
      get: {
        tags: ["Bancos"],
        summary: "Buscar banco por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Banco encontrado" },
          "404": { description: "Banco não encontrado" },
        },
      },
      put: {
        tags: ["Bancos"],
        summary: "Atualizar banco",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Banco" } } },
        },
        responses: {
          "200": { description: "Banco atualizado" },
          "404": { description: "Banco não encontrado" },
        },
      },
      delete: {
        tags: ["Bancos"],
        summary: "Excluir banco",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Banco excluído" },
          "404": { description: "Banco não encontrado" },
        },
      },
    },
    "/api/bancos/atualizar-bacen": {
      post: {
        tags: ["Bancos"],
        summary: "Atualizar lista de bancos com dados do Bacen",
        description: "Sincroniza a lista de bancos com os dados oficiais do Banco Central via Brasil API",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id_administradora"],
                properties: {
                  id_administradora: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Bancos atualizados com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Bancos atualizados com sucesso" },
                    data: {
                      type: "object",
                      properties: {
                        total: { type: "integer", example: 32 },
                        novos: { type: "integer", example: 5 },
                        atualizados: { type: "integer", example: 27 },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { description: "Erro ao atualizar bancos" },
        },
      },
    },
    "/api/moedas": {
      get: {
        tags: ["Moedas"],
        summary: "Listar todas as moedas",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "status", in: "query", schema: { type: "string", enum: ["ativo", "inativo"] } },
        ],
        responses: {
          "200": {
            description: "Lista de moedas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Moeda" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Moedas"],
        summary: "Criar nova moeda",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Moeda" } } },
        },
        responses: {
          "201": { description: "Moeda criada com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/moedas/{id}": {
      get: {
        tags: ["Moedas"],
        summary: "Buscar moeda por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Moeda encontrada" },
          "404": { description: "Moeda não encontrada" },
        },
      },
      put: {
        tags: ["Moedas"],
        summary: "Atualizar moeda",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Moeda" } } },
        },
        responses: {
          "200": { description: "Moeda atualizada" },
          "404": { description: "Moeda não encontrada" },
        },
      },
      delete: {
        tags: ["Moedas"],
        summary: "Excluir moeda",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Moeda excluída" },
          "404": { description: "Moeda não encontrada" },
        },
      },
    },
    "/api/moedas/atualizar-cotacoes": {
      post: {
        tags: ["Moedas"],
        summary: "Atualizar cotações de todas as moedas",
        description: "Busca cotações atualizadas de todas as moedas ativas via AwesomeAPI",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id_administradora"],
                properties: {
                  id_administradora: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Cotações atualizadas com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Cotações atualizadas com sucesso" },
                    data: {
                      type: "object",
                      properties: {
                        total: { type: "integer", example: 25 },
                        atualizadas: { type: "integer", example: 23 },
                        erros: { type: "integer", example: 2 },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": { description: "Erro ao atualizar cotações" },
        },
      },
    },
    "/api/feriados": {
      get: {
        tags: ["Feriados"],
        summary: "Listar todos os feriados",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id_administradora", in: "query", schema: { type: "integer" }, required: true },
          { name: "tipo", in: "query", schema: { type: "string", enum: ["nacional", "estadual", "municipal"] } },
          { name: "ano", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          "200": {
            description: "Lista de feriados",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/Feriado" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Feriados"],
        summary: "Criar novo feriado",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Feriado" } } },
        },
        responses: {
          "201": { description: "Feriado criado com sucesso" },
          "400": { description: "Dados inválidos" },
        },
      },
    },
    "/api/feriados/{id}": {
      get: {
        tags: ["Feriados"],
        summary: "Buscar feriado por ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Feriado encontrado" },
          "404": { description: "Feriado não encontrado" },
        },
      },
      put: {
        tags: ["Feriados"],
        summary: "Atualizar feriado",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Feriado" } } },
        },
        responses: {
          "200": { description: "Feriado atualizado" },
          "404": { description: "Feriado não encontrado" },
        },
      },
      delete: {
        tags: ["Feriados"],
        summary: "Excluir feriado",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Feriado excluído" },
          "404": { description: "Feriado não encontrado" },
        },
      },
    },
    "/api/cep/{cep}": {
      get: {
        tags: ["CEP"],
        summary: "Buscar endereço por CEP",
        description: "Consulta endereço completo através do CEP via ViaCEP",
        parameters: [{ name: "cep", in: "path", required: true, schema: { type: "string" }, example: "01310100" }],
        responses: {
          "200": {
            description: "Endereço encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/CEPResponse" },
                  },
                },
              },
            },
          },
          "404": { description: "CEP não encontrado" },
        },
      },
    },
    "/api/cep/buscar": {
      get: {
        tags: ["CEP"],
        summary: "Buscar endereços por logradouro",
        description: "Busca endereços através de UF, cidade e logradouro via ViaCEP",
        parameters: [
          { name: "uf", in: "query", required: true, schema: { type: "string" }, example: "SP" },
          { name: "cidade", in: "query", required: true, schema: { type: "string" }, example: "São Paulo" },
          { name: "logradouro", in: "query", required: true, schema: { type: "string" }, example: "Paulista" },
        ],
        responses: {
          "200": {
            description: "Endereços encontrados",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { type: "array", items: { $ref: "#/components/schemas/CEPResponse" } },
                  },
                },
              },
            },
          },
          "404": { description: "Nenhum endereço encontrado" },
        },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(swaggerSpec)
}
