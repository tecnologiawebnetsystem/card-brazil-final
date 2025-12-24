-- =====================================================
-- SCRIPT DDL: PESSOAS, ENDEREÇOS E DADOS BANCÁRIOS
-- =====================================================

-- Tabela de Pessoas (Física e Jurídica)
CREATE TABLE IF NOT EXISTS pessoas (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    tipo_pessoa VARCHAR(10) CHECK (tipo_pessoa IN ('fisica', 'juridica')) NOT NULL,
    
    -- Dados Pessoa Física
    nome VARCHAR(200),
    cpf VARCHAR(14),
    rg VARCHAR(20),
    data_nascimento DATE,
    genero VARCHAR(20) CHECK (genero IN ('masculino', 'feminino', 'outro', 'nao_informado')),
    estado_civil VARCHAR(20) CHECK (estado_civil IN ('solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel')),
    nome_mae VARCHAR(200),
    nome_pai VARCHAR(200),
    
    -- Dados Pessoa Jurídica
    razao_social VARCHAR(200),
    nome_fantasia VARCHAR(200),
    cnpj VARCHAR(18),
    inscricao_estadual VARCHAR(20),
    inscricao_municipal VARCHAR(20),
    data_fundacao DATE,
    
    -- Dados Comuns
    telefone VARCHAR(20),
    celular VARCHAR(20),
    email VARCHAR(100),
    site VARCHAR(100),
    observacoes TEXT,
    status VARCHAR(20) CHECK (status IN ('ativo', 'inativo', 'bloqueado')) DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id)
);

CREATE INDEX IF NOT EXISTS idx_pessoas_cpf ON pessoas(cpf);
CREATE INDEX IF NOT EXISTS idx_pessoas_cnpj ON pessoas(cnpj);
CREATE INDEX IF NOT EXISTS idx_pessoas_tipo ON pessoas(tipo_pessoa);
CREATE INDEX IF NOT EXISTS idx_pessoas_status ON pessoas(status);
CREATE INDEX IF NOT EXISTS idx_pessoas_admin ON pessoas(id_administradora);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pessoas_cpf_unique ON pessoas(id_administradora, cpf) WHERE cpf IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_pessoas_cnpj_unique ON pessoas(id_administradora, cnpj) WHERE cnpj IS NOT NULL;

-- Tabela de Endereços
CREATE TABLE IF NOT EXISTS enderecos (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    pessoa_id INT NOT NULL,
    tipo_endereco VARCHAR(20) CHECK (tipo_endereco IN ('residencial', 'comercial', 'cobranca', 'entrega', 'outro')) NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    pais VARCHAR(50) DEFAULT 'Brasil',
    
    observacoes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_enderecos_pessoa ON enderecos(pessoa_id);
CREATE INDEX IF NOT EXISTS idx_enderecos_tipo ON enderecos(tipo_endereco);
CREATE INDEX IF NOT EXISTS idx_enderecos_cep ON enderecos(cep);
CREATE INDEX IF NOT EXISTS idx_enderecos_admin ON enderecos(id_administradora);

-- Tabela de Dados Bancários
CREATE TABLE IF NOT EXISTS dados_bancarios (
    id SERIAL PRIMARY KEY,
    id_administradora INT NOT NULL,
    pessoa_id INT NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    
    banco_codigo VARCHAR(10) NOT NULL,
    banco_nome VARCHAR(100) NOT NULL,
    agencia VARCHAR(10) NOT NULL,
    agencia_digito VARCHAR(2),
    conta VARCHAR(20) NOT NULL,
    conta_digito VARCHAR(2) NOT NULL,
    tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('corrente', 'poupanca', 'salario', 'pagamento')) NOT NULL,
    
    pix_tipo VARCHAR(20) CHECK (pix_tipo IN ('cpf', 'cnpj', 'email', 'telefone', 'chave_aleatoria')),
    pix_chave VARCHAR(100),
    
    observacoes TEXT,
    status VARCHAR(20) CHECK (status IN ('ativo', 'inativo')) DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_dados_bancarios_pessoa ON dados_bancarios(pessoa_id);
CREATE INDEX IF NOT EXISTS idx_dados_bancarios_banco ON dados_bancarios(banco_codigo);
CREATE INDEX IF NOT EXISTS idx_dados_bancarios_status ON dados_bancarios(status);
CREATE INDEX IF NOT EXISTS idx_dados_bancarios_admin ON dados_bancarios(id_administradora);
