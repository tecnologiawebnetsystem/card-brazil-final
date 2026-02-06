"""
Script para criar todas as tabelas do Talent Health no Neon PostgreSQL
Executa os comandos DDL um por um para evitar erros de múltiplos comandos
"""

import os

# Definição de todas as tabelas do sistema
TABLES_DDL = [
    # PESSOAS E ENDEREÇOS
    {
        "name": "pessoas",
        "sql": """CREATE TABLE IF NOT EXISTS pessoas (
            id SERIAL PRIMARY KEY,
            administradora_id INTEGER NOT NULL REFERENCES administradoras(id),
            tipo_pessoa VARCHAR(20) CHECK (tipo_pessoa IN ('fisica', 'juridica')) NOT NULL,
            nome_completo VARCHAR(200),
            razao_social VARCHAR(200),
            nome_fantasia VARCHAR(200),
            cpf VARCHAR(14) UNIQUE,
            cnpj VARCHAR(18) UNIQUE,
            rg VARCHAR(20),
            data_nascimento DATE,
            sexo VARCHAR(1) CHECK (sexo IN ('M', 'F', 'O')),
            estado_civil VARCHAR(20),
            nome_mae VARCHAR(200),
            nome_pai VARCHAR(200),
            email VARCHAR(100),
            telefone_principal VARCHAR(20),
            telefone_secundario VARCHAR(20),
            telefone_comercial VARCHAR(20),
            profissao VARCHAR(100),
            renda_mensal DECIMAL(15,2),
            foto_url VARCHAR(500),
            observacoes TEXT,
            status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'bloqueado')) DEFAULT 'ativo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL
        )""",
        "indexes": [
            "CREATE INDEX idx_pessoas_cpf ON pessoas(cpf)",
            "CREATE INDEX idx_pessoas_cnpj ON pessoas(cnpj)",
            "CREATE INDEX idx_pessoas_adm ON pessoas(administradora_id)",
            "CREATE INDEX idx_pessoas_tipo ON pessoas(tipo_pessoa)"
        ]
    },
    
    # ENDEREÇOS
    {
        "name": "enderecos",
        "sql": """CREATE TABLE IF NOT EXISTS enderecos (
            id SERIAL PRIMARY KEY,
            pessoa_id INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
            tipo_endereco VARCHAR(20) CHECK (tipo_endereco IN ('residencial', 'comercial', 'correspondencia')) DEFAULT 'residencial',
            cep VARCHAR(9),
            logradouro VARCHAR(200),
            numero VARCHAR(10),
            complemento VARCHAR(100),
            bairro VARCHAR(100),
            cidade VARCHAR(100),
            estado VARCHAR(2),
            pais VARCHAR(50) DEFAULT 'Brasil',
            is_principal BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""",
        "indexes": [
            "CREATE INDEX idx_enderecos_pessoa ON enderecos(pessoa_id)",
            "CREATE INDEX idx_enderecos_cep ON enderecos(cep)"
        ]
    },
    
    # DADOS BANCÁRIOS
    {
        "name": "dados_bancarios",
        "sql": """CREATE TABLE IF NOT EXISTS dados_bancarios (
            id SERIAL PRIMARY KEY,
            pessoa_id INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
            banco_codigo VARCHAR(3),
            banco_nome VARCHAR(100),
            agencia VARCHAR(10),
            agencia_digito VARCHAR(2),
            conta VARCHAR(20),
            conta_digito VARCHAR(2),
            tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('corrente', 'poupanca', 'salario')),
            pix_tipo VARCHAR(20) CHECK (pix_tipo IN ('cpf', 'cnpj', 'email', 'telefone', 'chave_aleatoria')),
            pix_chave VARCHAR(100),
            is_principal BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""",
        "indexes": [
            "CREATE INDEX idx_dados_banc_pessoa ON dados_bancarios(pessoa_id)"
        ]
    },
    
    # OPERADORAS
    {
        "name": "operadoras",
        "sql": """CREATE TABLE IF NOT EXISTS operadoras (
            id SERIAL PRIMARY KEY,
            administradora_id INTEGER NOT NULL REFERENCES administradoras(id),
            pessoa_id INTEGER NOT NULL REFERENCES pessoas(id),
            registro_ans VARCHAR(10) UNIQUE NOT NULL,
            tipo_operadora VARCHAR(30) CHECK (tipo_operadora IN ('medicina_grupo', 'cooperativa_medica', 'autogestao', 'filantropia', 'seguradora', 'administradora_beneficios')),
            area_atuacao VARCHAR(20) CHECK (area_atuacao IN ('nacional', 'regional', 'municipal')),
            logotipo_url VARCHAR(500),
            site VARCHAR(200),
            contrato_url VARCHAR(500),
            observacoes TEXT,
            status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'suspenso')) DEFAULT 'ativo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL
        )""",
        "indexes": [
            "CREATE INDEX idx_operadoras_ans ON operadoras(registro_ans)",
            "CREATE INDEX idx_operadoras_adm ON operadoras(administradora_id)"
        ]
    },
    
    # ESTIPULANTES
    {
        "name": "estipulantes",
        "sql": """CREATE TABLE IF NOT EXISTS estipulantes (
            id SERIAL PRIMARY KEY,
            administradora_id INTEGER NOT NULL REFERENCES administradoras(id),
            pessoa_id INTEGER NOT NULL REFERENCES pessoas(id),
            codigo_interno VARCHAR(20) UNIQUE,
            tipo_estipulante VARCHAR(30) CHECK (tipo_estipulante IN ('empresa', 'sindicato', 'associacao', 'cooperativa', 'entidade_classe')),
            numero_funcionarios INTEGER,
            contrato_url VARCHAR(500),
            observacoes TEXT,
            status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'suspenso')) DEFAULT 'ativo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL
        )""",
        "indexes": [
            "CREATE INDEX idx_estipulantes_adm ON estipulantes(administradora_id)",
            "CREATE INDEX idx_estipulantes_codigo ON estipulantes(codigo_interno)"
        ]
    },
    
    # CORRETORES
    {
        "name": "corretores",
        "sql": """CREATE TABLE IF NOT EXISTS corretores (
            id SERIAL PRIMARY KEY,
            administradora_id INTEGER NOT NULL REFERENCES administradoras(id),
            pessoa_id INTEGER NOT NULL REFERENCES pessoas(id),
            registro_susep VARCHAR(20) UNIQUE NOT NULL,
            codigo_interno VARCHAR(20) UNIQUE,
            comissao_percentual DECIMAL(5,2),
            observacoes TEXT,
            status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'suspenso')) DEFAULT 'ativo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL
        )""",
        "indexes": [
            "CREATE INDEX idx_corretores_susep ON corretores(registro_susep)",
            "CREATE INDEX idx_corretores_adm ON corretores(administradora_id)"
        ]
    },
    
    # AGENCIADORES
    {
        "name": "agenciadores",
        "sql": """CREATE TABLE IF NOT EXISTS agenciadores (
            id SERIAL PRIMARY KEY,
            administradora_id INTEGER NOT NULL REFERENCES administradoras(id),
            pessoa_id INTEGER NOT NULL REFERENCES pessoas(id),
            codigo_interno VARCHAR(20) UNIQUE,
            comissao_percentual DECIMAL(5,2),
            observacoes TEXT,
            status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'suspenso')) DEFAULT 'ativo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP NULL
        )""",
        "indexes": [
            "CREATE INDEX idx_agenciadores_adm ON agenciadores(administradora_id)"
        ]
    }
]

print("Script de criação de tabelas preparado.")
print(f"Total de tabelas a criar: {len(TABLES_DDL)}")
print("Execute este script através do neon_run_sql para cada tabela")
