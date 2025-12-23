-- =====================================================
-- SCRIPT DML: COBRANÇA JUDICIAL - DADOS DE TESTE
-- Banco: MySQL 8.0+
-- =====================================================

USE cardbrazil;

-- Inserir 10 advogados
INSERT INTO advogados (
    id_administradora, nome, oab, oab_uf, cpf,
    email, telefone, celular,
    cep, logradouro, numero, complemento, bairro, cidade, uf,
    ativo, observacoes
) VALUES
(1, 'Dr. Carlos Alberto Silva', 'SP123456', 'SP', '111.222.333-44', 'carlos.silva@adv.com', '(11) 3333-4444', '(11) 98888-7777', '01310-100', 'Av. Paulista', '1000', 'Sala 501', 'Bela Vista', 'São Paulo', 'SP', TRUE, 'Especialista em direito civil'),
(1, 'Dra. Mariana Costa Santos', 'RJ234567', 'RJ', '222.333.444-55', 'mariana.santos@adv.com', '(21) 2222-3333', '(21) 97777-6666', '20040-020', 'Av. Rio Branco', '156', 'Sala 1201', 'Centro', 'Rio de Janeiro', 'RJ', TRUE, 'Especialista em cobrança'),
(1, 'Dr. Roberto Alves Pereira', 'MG345678', 'MG', '333.444.555-66', 'roberto.pereira@adv.com', '(31) 3344-5566', '(31) 96666-5555', '30130-100', 'Av. Afonso Pena', '867', 'Sala 302', 'Centro', 'Belo Horizonte', 'MG', TRUE, NULL),
(1, 'Dra. Fernanda Lima Oliveira', 'SP456789', 'SP', '444.555.666-77', 'fernanda.oliveira@adv.com', '(11) 4455-6677', '(11) 95555-4444', '01310-200', 'Rua Augusta', '2690', 'Conj. 81', 'Cerqueira César', 'São Paulo', 'SP', TRUE, 'Atuação em processos judiciais'),
(1, 'Dr. Paulo Henrique Costa', 'RS567890', 'RS', '555.666.777-88', 'paulo.costa@adv.com', '(51) 3366-7788', '(51) 94444-3333', '90010-270', 'Rua dos Andradas', '1234', 'Sala 405', 'Centro Histórico', 'Porto Alegre', 'RS', TRUE, NULL),
(1, 'Dra. Juliana Ferreira Souza', 'BA678901', 'BA', '666.777.888-99', 'juliana.souza@adv.com', '(71) 3377-8899', '(71) 93333-2222', '40020-000', 'Av. Sete de Setembro', '1238', 'Sala 601', 'Centro', 'Salvador', 'BA', TRUE, 'Especialista em execução'),
(1, 'Dr. Anderson Rodrigues Lima', 'PR789012', 'PR', '777.888.999-00', 'anderson.lima@adv.com', '(41) 3388-9900', '(41) 92222-1111', '80020-100', 'Rua XV de Novembro', '999', 'Sala 1003', 'Centro', 'Curitiba', 'PR', TRUE, NULL),
(1, 'Dra. Patrícia Mendes Alves', 'PE890123', 'PE', '888.999.000-11', 'patricia.alves@adv.com', '(81) 3399-0011', '(81) 91111-0000', '50010-000', 'Av. Guararapes', '111', 'Sala 802', 'Santo Antônio', 'Recife', 'PE', TRUE, 'Direito empresarial'),
(1, 'Dr. Ricardo Santos Barbosa', 'CE901234', 'CE', '999.000.111-22', 'ricardo.barbosa@adv.com', '(85) 3300-1122', '(85) 90000-9999', '60060-000', 'Av. Beira Mar', '3000', 'Sala 1501', 'Meireles', 'Fortaleza', 'CE', TRUE, NULL),
(1, 'Dra. Camila Oliveira Rocha', 'DF012345', 'DF', '000.111.222-33', 'camila.rocha@adv.com', '(61) 3311-2233', '(61) 99999-8888', '70040-020', 'SCS Quadra 1', '50', 'Sala 1202', 'Asa Sul', 'Brasília', 'DF', TRUE, 'Consultoria jurídica');

-- Inserir 15 tribunais
INSERT INTO tribunais (
    id_administradora, nome, sigla, tipo, instancia,
    uf, cidade, telefone, email, site,
    cep, logradouro, numero, complemento, bairro, ativo
) VALUES
(1, 'Tribunal de Justiça de São Paulo', 'TJSP', 'estadual', 'segunda', 'SP', 'São Paulo', '(11) 3242-7000', 'atendimento@tjsp.jus.br', 'www.tjsp.jus.br', '01037-000', 'Praça da Sé', 's/n', NULL, 'Sé', TRUE),
(1, 'Tribunal de Justiça do Rio de Janeiro', 'TJRJ', 'estadual', 'segunda', 'RJ', 'Rio de Janeiro', '(21) 3133-3000', 'atendimento@tjrj.jus.br', 'www.tjrj.jus.br', '20020-080', 'Av. Erasmo Braga', '115', NULL, 'Centro', TRUE),
(1, 'Tribunal de Justiça de Minas Gerais', 'TJMG', 'estadual', 'segunda', 'MG', 'Belo Horizonte', '(31) 3306-3000', 'atendimento@tjmg.jus.br', 'www.tjmg.jus.br', '30190-922', 'Av. Afonso Pena', '1470', NULL, 'Centro', TRUE),
(1, 'Tribunal Regional Federal da 3ª Região', 'TRF3', 'federal', 'segunda', 'SP', 'São Paulo', '(11) 3012-3600', 'atendimento@trf3.jus.br', 'www.trf3.jus.br', '01310-100', 'Av. Paulista', '1842', NULL, 'Bela Vista', TRUE),
(1, 'Tribunal Regional Federal da 2ª Região', 'TRF2', 'federal', 'segunda', 'RJ', 'Rio de Janeiro', '(21) 3261-6000', 'atendimento@trf2.jus.br', 'www.trf2.jus.br', '20020-080', 'Rua Acre', '80', NULL, 'Centro', TRUE),
(1, 'Superior Tribunal de Justiça', 'STJ', 'federal', 'superior', 'DF', 'Brasília', '(61) 3319-8000', 'atendimento@stj.jus.br', 'www.stj.jus.br', '70175-900', 'SAFS Quadra 6', 'Lote 1', NULL, 'Asa Sul', TRUE),
(1, 'Supremo Tribunal Federal', 'STF', 'federal', 'supremo', 'DF', 'Brasília', '(61) 3217-3000', 'atendimento@stf.jus.br', 'www.stf.jus.br', '70175-900', 'Praça dos Três Poderes', 's/n', NULL, 'Zona Cívico-Administrativa', TRUE),
(1, 'Tribunal de Justiça do Rio Grande do Sul', 'TJRS', 'estadual', 'segunda', 'RS', 'Porto Alegre', '(51) 3210-6000', 'atendimento@tjrs.jus.br', 'www.tjrs.jus.br', '90010-395', 'Praça Marechal Deodoro', '55', NULL, 'Centro Histórico', TRUE),
(1, 'Tribunal de Justiça da Bahia', 'TJBA', 'estadual', 'segunda', 'BA', 'Salvador', '(71) 3372-5555', 'atendimento@tjba.jus.br', 'www.tjba.jus.br', '40020-000', 'Av. Joana Angélica', '1312', NULL, 'Nazaré', TRUE),
(1, 'Tribunal de Justiça do Paraná', 'TJPR', 'estadual', 'segunda', 'PR', 'Curitiba', '(41) 3330-3000', 'atendimento@tjpr.jus.br', 'www.tjpr.jus.br', '80530-915', 'Praça Nossa Senhora da Salete', 's/n', NULL, 'Centro Cívico', TRUE),
(1, 'Tribunal de Justiça de Pernambuco', 'TJPE', 'estadual', 'segunda', 'PE', 'Recife', '(81) 3419-3000', 'atendimento@tjpe.jus.br', 'www.tjpe.jus.br', '50010-230', 'Praça da República', 's/n', NULL, 'Santo Antônio', TRUE),
(1, 'Tribunal de Justiça do Ceará', 'TJCE', 'estadual', 'segunda', 'CE', 'Fortaleza', '(85) 3198-3000', 'atendimento@tjce.jus.br', 'www.tjce.jus.br', '60060-000', 'Rua Assunção', '1200', NULL, 'José Bonifácio', TRUE),
(1, 'Tribunal de Justiça do Distrito Federal', 'TJDFT', 'estadual', 'segunda', 'DF', 'Brasília', '(61) 3103-3000', 'atendimento@tjdft.jus.br', 'www.tjdft.jus.br', '70093-900', 'Eixo Monumental', 'Praça Municipal', 'Lote 1', 'Zona Cívico-Administrativa', TRUE),
(1, 'Tribunal Regional Federal da 1ª Região', 'TRF1', 'federal', 'segunda', 'DF', 'Brasília', '(61) 3314-5000', 'atendimento@trf1.jus.br', 'www.trf1.jus.br', '70093-900', 'SAS Quadra 1', 'Bloco A', NULL, 'Asa Sul', TRUE),
(1, 'Tribunal Regional Federal da 4ª Região', 'TRF4', 'federal', 'segunda', 'RS', 'Porto Alegre', '(51) 3213-3000', 'atendimento@trf4.jus.br', 'www.trf4.jus.br', '90010-395', 'Rua Otávio Francisco Caruso da Rocha', '300', NULL, 'Praia de Belas', TRUE);

-- Inserir 20 processos judiciais
INSERT INTO processos_judiciais (
    id_administradora, beneficiario_id, advogado_id, tribunal_id, conta_receber_id,
    numero_processo, tipo_acao, valor_causa,
    data_distribuicao, data_citacao, data_audiencia, data_sentenca, data_transito_julgado,
    status, fase_processual, resultado,
    valor_sentenca, valor_acordo, valor_recuperado,
    observacoes, created_by
) VALUES
-- Processos EM ANDAMENTO
(1, 11, 1, 1, 11, '1000001-11.2024.8.26.0100', 'cobranca', 481.50, '2024-01-15', '2024-02-10', '2024-03-20', NULL, NULL, 'em_andamento', 'instrucao', 'em_andamento', NULL, NULL, 0, 'Processo em fase de instrução', 1),
(1, 12, 2, 2, 12, '0000002-22.2024.8.19.0001', 'execucao', 472.50, '2024-02-01', '2024-02-25', NULL, NULL, NULL, 'em_andamento', 'citacao', 'em_andamento', NULL, NULL, 0, 'Aguardando citação do devedor', 1),
(1, 13, 3, 3, 13, '5000003-33.2024.8.13.0024', 'monitoria', 367.50, '2024-02-15', '2024-03-05', '2024-04-10', NULL, NULL, 'em_andamento', 'contestacao', 'em_andamento', NULL, NULL, 0, 'Devedor apresentou contestação', 1),
(1, 14, 1, 1, 14, '1000004-44.2024.8.26.0100', 'cobranca', 468.00, '2024-02-20', '2024-03-15', NULL, NULL, NULL, 'em_andamento', 'inicial', 'em_andamento', NULL, NULL, 0, 'Processo distribuído', 1),
(1, 15, 4, 4, 15, '0000005-55.2024.4.03.6100', 'execucao', 210.00, '2024-03-01', NULL, NULL, NULL, NULL, 'em_andamento', 'inicial', 'em_andamento', NULL, NULL, 0, 'Aguardando citação', 1),

-- Processos com SENTENÇA FAVORÁVEL
(1, 24, 2, 2, 24, '0000006-66.2023.8.19.0001', 'cobranca', 45.00, '2023-11-10', '2023-12-05', '2024-01-15', '2024-02-20', NULL, 'sentenca_favoravel', 'sentenca', 'procedente', 52.00, NULL, 52.00, 'Sentença procedente com juros e correção', 1),
(1, 25, 3, 3, 25, '5000007-77.2023.8.13.0024', 'monitoria', 22.50, '2023-12-01', '2023-12-20', '2024-01-25', '2024-02-28', NULL, 'sentenca_favoravel', 'sentenca', 'procedente', 26.00, NULL, 26.00, 'Valor recuperado integralmente', 1),

-- Processos com ACORDO
(1, 16, 1, 1, 16, '1000008-88.2024.8.26.0100', 'cobranca', 250.00, '2024-01-20', '2024-02-15', '2024-03-10', NULL, NULL, 'acordo', 'sentenca', 'acordo', NULL, 200.00, 200.00, 'Acordo homologado - pagamento em 2 parcelas', 1),
(1, 17, 4, 4, 17, '0000009-99.2024.4.03.6100', 'execucao', 750.00, '2024-02-05', '2024-02-28', '2024-03-25', NULL, NULL, 'acordo', 'sentenca', 'acordo', NULL, 600.00, 600.00, 'Acordo com desconto de 20%', 1),
(1, 18, 2, 2, 18, '0000010-00.2024.8.19.0001', 'monitoria', 400.00, '2024-02-10', '2024-03-05', '2024-04-01', NULL, NULL, 'acordo', 'instrucao', 'acordo', NULL, 350.00, 350.00, 'Acordo realizado antes da sentença', 1),

-- Processos ARQUIVADOS
(1, 19, 5, 5, 19, '0000011-11.2024.8.21.0001', 'cobranca', 450.00, '2024-01-10', '2024-02-05', NULL, NULL, NULL, 'arquivado', 'inicial', 'desistencia', NULL, NULL, 0, 'Processo arquivado por desistência', 1),
(1, 20, 6, 6, 20, '5000012-22.2024.8.05.0001', 'execucao', 850.00, '2024-01-25', NULL, NULL, NULL, NULL, 'arquivado', 'inicial', 'desistencia', NULL, NULL, 0, 'Arquivado - proposta cancelada', 1),

-- Processos SUSPENSOS
(1, 21, 7, 7, 21, '9000013-33.2024.8.16.0001', 'cobranca', 450.00, '2024-02-01', '2024-02-25', NULL, NULL, NULL, 'suspenso', 'citacao', 'em_andamento', NULL, NULL, 0, 'Processo suspenso por acordo de parcelamento', 1),
(1, 22, 8, 8, 22, '5000014-44.2024.8.21.0001', 'monitoria', 60.00, '2024-03-01', NULL, NULL, NULL, NULL, 'suspenso', 'inicial', 'em_andamento', NULL, NULL, 0, 'Suspenso aguardando documentação', 1),

-- Processos com SENTENÇA DESFAVORÁVEL
(1, 23, 9, 9, 23, '0000015-55.2023.8.17.0001', 'cobranca', 450.00, '2023-10-15', '2023-11-10', '2023-12-20', '2024-01-30', NULL, 'sentenca_desfavoravel', 'sentenca', 'improcedente', NULL, NULL, 0, 'Sentença improcedente - falta de provas', 1),

-- Mais processos variados
(1, 26, 10, 10, 26, '9000016-66.2024.8.16.0001', 'execucao', 450.00, '2024-03-10', NULL, NULL, NULL, NULL, 'em_andamento', 'inicial', 'em_andamento', NULL, NULL, 0, 'Processo recém distribuído', 1),
(1, 27, 1, 1, 27, '1000017-77.2024.8.26.0100', 'cobranca', 35.00, '2024-03-15', '2024-04-05', NULL, NULL, NULL, 'em_andamento', 'citacao', 'em_andamento', NULL, NULL, 0, 'Aguardando citação', 1),
(1, 28, 2, 2, 28, '0000018-88.2024.8.19.0001', 'monitoria', 90.00, '2024-03-20', NULL, NULL, NULL, NULL, 'em_andamento', 'inicial', 'em_andamento', NULL, NULL, 0, 'Processo em fase inicial', 1),
(1, 29, 3, 3, 29, '5000019-99.2024.8.13.0024', 'cobranca', 450.00, '2024-04-01', NULL, NULL, NULL, NULL, 'em_andamento', 'inicial', 'em_andamento', NULL, NULL, 0, 'Recém distribuído', 1),
(1, 30, 4, 4, 30, '0000020-00.2024.4.03.6100', 'execucao', 150.00, '2024-04-05', NULL, NULL, NULL, NULL, 'em_andamento', 'inicial', 'em_andamento', NULL, NULL, 0, 'Processo iniciado', 1);
