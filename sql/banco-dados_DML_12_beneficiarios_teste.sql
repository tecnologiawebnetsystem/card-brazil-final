-- =====================================================
-- SCRIPT DML: BENEFICIÁRIOS DE TESTE
-- Banco: MySQL 8.0+
-- Descrição: Insere 68 beneficiários (30 titulares + 38 dependentes)
-- =====================================================

USE cardbrazil;

-- =====================================================
-- BENEFICIÁRIOS TITULARES (30 registros)
-- =====================================================

-- Titulares 1-10 (Contratos 1-10)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 1, 1, '0001-0001-0001', 'titular', NULL, 'titular', '2024-01-15', 'ativo'),
(1, 2, 2, '0002-0001-0001', 'titular', NULL, 'titular', '2024-01-20', 'ativo'),
(1, 3, 3, '0003-0001-0001', 'titular', NULL, 'titular', '2024-02-01', 'ativo'),
(1, 4, 4, '0004-0001-0001', 'titular', NULL, 'titular', '2024-02-10', 'ativo'),
(1, 5, 5, '0005-0001-0001', 'titular', NULL, 'titular', '2024-02-15', 'ativo'),
(1, 6, 6, '0006-0001-0001', 'titular', NULL, 'titular', '2024-03-01', 'ativo'),
(1, 7, 7, '0007-0001-0001', 'titular', NULL, 'titular', '2024-03-10', 'ativo'),
(1, 8, 8, '0008-0001-0001', 'titular', NULL, 'titular', '2024-03-15', 'ativo'),
(1, 9, 9, '0009-0001-0001', 'titular', NULL, 'titular', '2024-04-01', 'ativo'),
(1, 10, 10, '0010-0001-0001', 'titular', NULL, 'titular', '2024-04-10', 'ativo');

-- Titulares 11-20 (Contratos 11-20)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 11, 11, '0011-0001-0001', 'titular', NULL, 'titular', '2024-04-15', 'ativo'),
(1, 12, 12, '0012-0001-0001', 'titular', NULL, 'titular', '2024-05-01', 'ativo'),
(1, 13, 13, '0013-0001-0001', 'titular', NULL, 'titular', '2024-05-10', 'ativo'),
(1, 14, 14, '0014-0001-0001', 'titular', NULL, 'titular', '2024-05-15', 'ativo'),
(1, 15, 15, '0015-0001-0001', 'titular', NULL, 'titular', '2024-06-01', 'ativo'),
(1, 16, 16, '0016-0001-0001', 'titular', NULL, 'titular', '2024-06-10', 'suspenso'),
(1, 17, 17, '0017-0001-0001', 'titular', NULL, 'titular', '2024-06-15', 'ativo'),
(1, 18, 18, '0018-0001-0001', 'titular', NULL, 'titular', '2024-07-01', 'ativo'),
(1, 19, 19, '0019-0001-0001', 'titular', NULL, 'titular', '2024-07-10', 'ativo'),
(1, 20, 20, '0020-0001-0001', 'titular', NULL, 'titular', '2024-07-15', 'ativo');

-- Titulares 21-30 (Contratos 21-30)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 21, 21, '0021-0001-0001', 'titular', NULL, 'titular', '2024-08-01', 'ativo'),
(1, 22, 22, '0022-0001-0001', 'titular', NULL, 'titular', '2024-08-10', 'ativo'),
(1, 23, 23, '0023-0001-0001', 'titular', NULL, 'titular', '2024-08-15', 'ativo'),
(1, 24, 24, '0024-0001-0001', 'titular', NULL, 'titular', '2024-09-01', 'ativo'),
(1, 25, 25, '0025-0001-0001', 'titular', NULL, 'titular', '2024-09-10', 'ativo'),
(1, 26, 26, '0026-0001-0001', 'titular', NULL, 'titular', '2024-09-15', 'cancelado'),
(1, 27, 27, '0027-0001-0001', 'titular', NULL, 'titular', '2024-10-01', 'ativo'),
(1, 28, 28, '0028-0001-0001', 'titular', NULL, 'titular', '2024-10-10', 'ativo'),
(1, 29, 29, '0029-0001-0001', 'titular', NULL, 'titular', '2024-10-15', 'ativo'),
(1, 30, 30, '0030-0001-0001', 'titular', NULL, 'titular', '2024-11-01', 'ativo');

-- =====================================================
-- DEPENDENTES (38 registros)
-- =====================================================

-- Dependentes do Titular 1 (3 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 1, 31, '0001-0002-0001', 'dependente', 1, 'conjuge', '2024-01-15', 'ativo'),
(1, 1, 32, '0001-0003-0001', 'dependente', 1, 'filho', '2024-01-15', 'ativo'),
(1, 1, 33, '0001-0004-0001', 'dependente', 1, 'filho', '2024-01-15', 'ativo');

-- Dependentes do Titular 2 (2 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 2, 34, '0002-0002-0001', 'dependente', 2, 'conjuge', '2024-01-20', 'ativo'),
(1, 2, 35, '0002-0003-0001', 'dependente', 2, 'filho', '2024-01-20', 'ativo');

-- Dependentes do Titular 3 (1 dependente)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 3, 36, '0003-0002-0001', 'dependente', 3, 'conjuge', '2024-02-01', 'ativo');

-- Dependentes do Titular 4 (2 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 4, 37, '0004-0002-0001', 'dependente', 4, 'conjuge', '2024-02-10', 'ativo'),
(1, 4, 38, '0004-0003-0001', 'dependente', 4, 'filho', '2024-02-10', 'ativo');

-- Dependentes do Titular 5 (3 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 5, 39, '0005-0002-0001', 'dependente', 5, 'conjuge', '2024-02-15', 'ativo'),
(1, 5, 40, '0005-0003-0001', 'dependente', 5, 'filho', '2024-02-15', 'ativo'),
(1, 5, 41, '0005-0004-0001', 'dependente', 5, 'filho', '2024-02-15', 'ativo');

-- Dependentes do Titular 6 (2 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 6, 42, '0006-0002-0001', 'dependente', 6, 'conjuge', '2024-03-01', 'ativo'),
(1, 6, 43, '0006-0003-0001', 'dependente', 6, 'filho', '2024-03-01', 'ativo');

-- Dependentes do Titular 7 (1 dependente)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 7, 44, '0007-0002-0001', 'dependente', 7, 'conjuge', '2024-03-10', 'ativo');

-- Dependentes do Titular 8 (2 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 8, 45, '0008-0002-0001', 'dependente', 8, 'conjuge', '2024-03-15', 'ativo'),
(1, 8, 46, '0008-0003-0001', 'dependente', 8, 'filho', '2024-03-15', 'ativo');

-- Dependentes do Titular 9 (3 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 9, 47, '0009-0002-0001', 'dependente', 9, 'conjuge', '2024-04-01', 'ativo'),
(1, 9, 48, '0009-0003-0001', 'dependente', 9, 'filho', '2024-04-01', 'ativo'),
(1, 9, 49, '0009-0004-0001', 'dependente', 9, 'filho', '2024-04-01', 'ativo');

-- Dependentes do Titular 10 (2 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 10, 50, '0010-0002-0001', 'dependente', 10, 'conjuge', '2024-04-10', 'ativo'),
(1, 10, 51, '0010-0003-0001', 'dependente', 10, 'filho', '2024-04-10', 'ativo');

-- Dependentes do Titular 11 (1 dependente)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 11, 52, '0011-0002-0001', 'dependente', 11, 'conjuge', '2024-04-15', 'ativo');

-- Dependentes do Titular 12 (2 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 12, 53, '0012-0002-0001', 'dependente', 12, 'conjuge', '2024-05-01', 'ativo'),
(1, 12, 54, '0012-0003-0001', 'dependente', 12, 'filho', '2024-05-01', 'ativo');

-- Dependentes do Titular 13 (3 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 13, 55, '0013-0002-0001', 'dependente', 13, 'conjuge', '2024-05-10', 'ativo'),
(1, 13, 56, '0013-0003-0001', 'dependente', 13, 'filho', '2024-05-10', 'ativo'),
(1, 13, 57, '0013-0004-0001', 'dependente', 13, 'filho', '2024-05-10', 'ativo');

-- Dependentes do Titular 14 (2 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 14, 58, '0014-0002-0001', 'dependente', 14, 'conjuge', '2024-05-15', 'ativo'),
(1, 14, 59, '0014-0003-0001', 'dependente', 14, 'filho', '2024-05-15', 'ativo');

-- Dependentes do Titular 15 (1 dependente)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 15, 60, '0015-0002-0001', 'dependente', 15, 'conjuge', '2024-06-01', 'ativo');

-- Dependentes do Titular 16 (2 dependentes - suspensos)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 16, 16, '0016-0002-0001', 'dependente', 16, 'conjuge', '2024-06-10', 'suspenso'),
(1, 16, 17, '0016-0003-0001', 'dependente', 16, 'filho', '2024-06-10', 'suspenso');

-- Dependentes do Titular 20 (2 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 20, 18, '0020-0002-0001', 'dependente', 20, 'conjuge', '2024-07-15', 'ativo'),
(1, 20, 19, '0020-0003-0001', 'dependente', 20, 'filho', '2024-07-15', 'ativo');

-- Dependentes do Titular 25 (1 dependente)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 25, 20, '0025-0002-0001', 'dependente', 25, 'conjuge', '2024-09-10', 'ativo');

-- Dependentes do Titular 30 (2 dependentes)
INSERT INTO beneficiarios (id_administradora, contrato_id, pessoa_id, numero_carteirinha, tipo_beneficiario, titular_id, parentesco, data_inclusao, status) VALUES
(1, 30, 21, '0030-0002-0001', 'dependente', 30, 'conjuge', '2024-11-01', 'ativo'),
(1, 30, 22, '0030-0003-0001', 'dependente', 30, 'filho', '2024-11-01', 'ativo');
