-- =====================================================
-- SCRIPT DML: CONTAS A PAGAR - DADOS DE TESTE
-- Banco: MySQL 8.0+
-- =====================================================

USE cardbrazil;

-- Inserir 30 contas a pagar com diferentes tipos e status
INSERT INTO contas_pagar (
    id_administradora, fornecedor_id, beneficiario_id, proposta_id,
    numero_documento, descricao, categoria, tipo_conta,
    valor_original, valor_multa, valor_juros, valor_desconto, valor_total, valor_pago,
    data_emissao, data_vencimento, data_pagamento,
    status, dias_atraso,
    forma_pagamento, conta_bancaria_id,
    favorecido_nome, favorecido_cpf_cnpj, favorecido_banco, favorecido_agencia, favorecido_conta, favorecido_tipo_conta, favorecido_pix_chave,
    observacoes, created_by
) VALUES
-- RESTITUIÇÕES A BENEFICIÁRIOS
(1, NULL, 1, 1, 'CP-REST-001', 'Restituição pagamento duplicado - João Silva', 'pagamento_duplicado', 'restituicao_beneficiario', 450.00, 0, 0, 0, 450.00, 450.00, '2024-01-15', '2024-01-20', '2024-01-19', 'pago', 0, 'pix', 1, 'João Silva', '123.456.789-00', '001', '1234', '12345-6', 'corrente', '123.456.789-00', 'Restituição realizada via PIX', 1),
(1, NULL, 5, 5, 'CP-REST-002', 'Restituição cobrança indevida - Pedro Costa', 'pagamento_duplicado', 'restituicao_beneficiario', 450.00, 0, 0, 0, 450.00, 0, '2024-02-10', '2024-02-15', NULL, 'pendente', 0, 'transferencia', 1, 'Pedro Costa', '987.654.321-00', '237', '5678', '98765-4', 'corrente', NULL, 'Aguardando processamento', 1),
(1, NULL, 10, 10, 'CP-REST-003', 'Restituição cancelamento contrato', 'restituicao', 'restituicao_beneficiario', 850.00, 0, 0, 0, 850.00, 0, '2024-03-05', '2024-03-12', NULL, 'pendente', 0, 'pix', 1, 'Ana Santos', '456.789.123-00', '341', '9012', '45678-9', 'poupanca', '456.789.123-00', 'Cancelamento solicitado', 1),

-- REEMBOLSOS DE PROCEDIMENTOS
(1, NULL, 3, 3, 'CP-REEMB-001', 'Reembolso consulta particular - Maria Santos', 'consultas', 'reembolso_procedimento', 250.00, 0, 0, 0, 250.00, 250.00, '2024-01-20', '2024-01-30', '2024-01-28', 'pago', 0, 'transferencia', 1, 'Maria Santos', '321.654.987-00', '104', '3456', '23456-7', 'corrente', NULL, 'Reembolso aprovado e pago', 1),
(1, NULL, 7, 7, 'CP-REEMB-002', 'Reembolso exames laboratoriais', 'exames', 'reembolso_procedimento', 380.00, 0, 0, 0, 380.00, 0, '2024-02-15', '2024-02-25', NULL, 'pendente', 0, 'pix', 1, 'Carlos Oliveira', '789.123.456-00', '033', '7890', '67890-1', 'corrente', '789.123.456-00', 'Em análise', 1),
(1, NULL, 12, 12, 'CP-REEMB-003', 'Reembolso medicamentos', 'medicamentos', 'reembolso_procedimento', 520.00, 0, 0, 0, 520.00, 520.00, '2024-03-01', '2024-03-10', '2024-03-08', 'pago', 0, 'transferencia', 1, 'Fernanda Lima', '654.321.987-00', '001', '2345', '34567-8', 'corrente', NULL, 'Reembolso processado', 1),

-- FORNECEDORES - SERVIÇOS MÉDICOS
(1, 31, NULL, NULL, 'CP-FORN-001', 'Pagamento Hospital Central - Internações Janeiro', 'internacoes', 'fornecedor', 45000.00, 0, 0, 0, 45000.00, 45000.00, '2024-01-25', '2024-02-10', '2024-02-08', 'pago', 0, 'transferencia', 1, 'Hospital Central LTDA', '12.345.678/0001-90', '001', '1111', '11111-1', 'corrente', NULL, 'Pagamento realizado', 1),
(1, 32, NULL, NULL, 'CP-FORN-002', 'Clínica São Paulo - Consultas Fevereiro', 'consultas', 'fornecedor', 12500.00, 0, 0, 0, 12500.00, 0, '2024-02-28', '2024-03-15', NULL, 'pendente', 0, 'transferencia', 1, 'Clínica São Paulo S/A', '23.456.789/0001-01', '237', '2222', '22222-2', 'corrente', NULL, 'Aguardando vencimento', 1),
(1, 33, NULL, NULL, 'CP-FORN-003', 'Laboratório Central - Exames Março', 'exames', 'fornecedor', 8900.00, 0, 0, 0, 8900.00, 0, '2024-03-25', '2024-04-10', NULL, 'pendente', 0, 'boleto', 1, 'Laboratório Central LTDA', '34.567.890/0001-12', '341', '3333', '33333-3', 'corrente', NULL, 'Boleto emitido', 1),
(1, 34, NULL, NULL, 'CP-FORN-004', 'Farmácia Saúde - Medicamentos Janeiro', 'medicamentos', 'fornecedor', 15600.00, 0, 0, 0, 15600.00, 15600.00, '2024-01-30', '2024-02-15', '2024-02-14', 'pago', 0, 'pix', 1, 'Farmácia Saúde LTDA', '45.678.901/0001-23', '104', '4444', '44444-4', 'corrente', '45.678.901/0001-23', 'Pagamento via PIX', 1),
(1, 35, NULL, NULL, 'CP-FORN-005', 'Hospital Santa Casa - Cirurgias Fevereiro', 'servicos_medicos', 'fornecedor', 78000.00, 0, 0, 0, 78000.00, 0, '2024-02-28', '2024-03-20', NULL, 'pendente', 0, 'transferencia', 1, 'Santa Casa de Misericórdia', '56.789.012/0001-34', '033', '5555', '55555-5', 'corrente', NULL, 'Programado para pagamento', 1),

-- FORNECEDORES - OPERACIONAL
(1, 36, NULL, NULL, 'CP-OPER-001', 'Aluguel escritório - Janeiro 2024', 'outro', 'operacional', 8500.00, 0, 0, 0, 8500.00, 8500.00, '2024-01-05', '2024-01-10', '2024-01-09', 'pago', 0, 'transferencia', 1, 'Imobiliária Prime LTDA', '67.890.123/0001-45', '001', '6666', '66666-6', 'corrente', NULL, 'Aluguel pago', 1),
(1, 37, NULL, NULL, 'CP-OPER-002', 'Energia elétrica - Fevereiro 2024', 'outro', 'operacional', 2300.00, 0, 0, 0, 2300.00, 2300.00, '2024-02-15', '2024-02-25', '2024-02-23', 'pago', 0, 'boleto', 1, 'Companhia de Energia', '78.901.234/0001-56', '237', '7777', '77777-7', 'corrente', NULL, 'Conta de luz paga', 1),
(1, 38, NULL, NULL, 'CP-OPER-003', 'Internet e telefonia - Março 2024', 'outro', 'operacional', 1200.00, 0, 0, 0, 1200.00, 0, '2024-03-10', '2024-03-20', NULL, 'pendente', 0, 'boleto', 1, 'Telecom Brasil S/A', '89.012.345/0001-67', '341', '8888', '88888-8', 'corrente', NULL, 'Aguardando vencimento', 1),
(1, 39, NULL, NULL, 'CP-OPER-004', 'Material de escritório', 'outro', 'operacional', 850.00, 0, 0, 0, 850.00, 850.00, '2024-02-20', '2024-03-05', '2024-03-04', 'pago', 0, 'cartao', 1, 'Papelaria Central LTDA', '90.123.456/0001-78', '104', '9999', '99999-9', 'corrente', NULL, 'Pagamento no cartão', 1),
(1, 40, NULL, NULL, 'CP-OPER-005', 'Manutenção sistema - Abril 2024', 'outro', 'operacional', 3500.00, 0, 0, 0, 3500.00, 0, '2024-04-01', '2024-04-15', NULL, 'pendente', 0, 'pix', 1, 'TechSolutions LTDA', '01.234.567/0001-89', '033', '1010', '10101-0', 'corrente', '01.234.567/0001-89', 'Manutenção mensal', 1),

-- IMPOSTOS
(1, NULL, NULL, NULL, 'CP-IMP-001', 'IRPJ - Janeiro 2024', 'impostos', 'operacional', 12000.00, 0, 0, 0, 12000.00, 12000.00, '2024-01-20', '2024-01-31', '2024-01-30', 'pago', 0, 'transferencia', 1, 'Receita Federal', '00.000.000/0001-91', '001', '0001', '00001-0', 'corrente', NULL, 'Imposto pago', 1),
(1, NULL, NULL, NULL, 'CP-IMP-002', 'CSLL - Fevereiro 2024', 'impostos', 'operacional', 8500.00, 0, 0, 0, 8500.00, 8500.00, '2024-02-20', '2024-02-29', '2024-02-28', 'pago', 0, 'transferencia', 1, 'Receita Federal', '00.000.000/0001-91', '001', '0001', '00001-0', 'corrente', NULL, 'Imposto pago', 1),
(1, NULL, NULL, NULL, 'CP-IMP-003', 'ISS - Março 2024', 'impostos', 'operacional', 4200.00, 0, 0, 0, 4200.00, 0, '2024-03-15', '2024-03-31', NULL, 'pendente', 0, 'transferencia', 1, 'Prefeitura Municipal', '00.000.001/0001-92', '237', '0002', '00002-1', 'corrente', NULL, 'Aguardando vencimento', 1),

-- CONTAS VENCIDAS
(1, 41, NULL, NULL, 'CP-FORN-006', 'Clínica Odontológica - Dezembro 2023', 'servicos_medicos', 'fornecedor', 5600.00, 112.00, 168.00, 0, 5880.00, 0, '2023-12-20', '2024-01-10', NULL, 'vencido', 90, 'transferencia', 1, 'Clínica Dental Plus', '11.222.333/0001-44', '341', '1212', '12121-2', 'corrente', NULL, 'Conta vencida - negociando', 1),
(1, 42, NULL, NULL, 'CP-FORN-007', 'Laboratório Análises - Janeiro 2024', 'exames', 'fornecedor', 3200.00, 64.00, 96.00, 0, 3360.00, 0, '2024-01-25', '2024-02-10', NULL, 'vencido', 60, 'boleto', 1, 'Lab Análises Clínicas', '22.333.444/0001-55', '104', '1313', '13131-3', 'corrente', NULL, 'Conta vencida', 1),

-- CONTAS PROGRAMADAS
(1, 43, NULL, NULL, 'CP-PROG-001', 'Hospital Regional - Abril 2024', 'internacoes', 'fornecedor', 52000.00, 0, 0, 0, 52000.00, 0, '2024-04-01', '2024-04-20', NULL, 'programado', 0, 'transferencia', 1, 'Hospital Regional S/A', '33.444.555/0001-66', '033', '1414', '14141-4', 'corrente', NULL, 'Pagamento programado para 20/04', 1),
(1, 44, NULL, NULL, 'CP-PROG-002', 'Clínica Fisioterapia - Maio 2024', 'servicos_medicos', 'fornecedor', 8900.00, 0, 0, 0, 8900.00, 0, '2024-05-01', '2024-05-15', NULL, 'programado', 0, 'pix', 1, 'Fisio Center LTDA', '44.555.666/0001-77', '001', '1515', '15151-5', 'corrente', '44.555.666/0001-77', 'Pagamento programado via PIX', 1),

-- CONTAS CANCELADAS
(1, 45, NULL, NULL, 'CP-CANC-001', 'Fornecedor XYZ - Cancelado', 'outro', 'fornecedor', 2500.00, 0, 0, 0, 2500.00, 0, '2024-03-10', '2024-03-25', NULL, 'cancelado', 0, NULL, NULL, 'Fornecedor XYZ LTDA', '55.666.777/0001-88', '237', '1616', '16161-6', 'corrente', NULL, 'Cancelado por erro de lançamento', 1),

-- MAIS CONTAS VARIADAS
(1, 46, NULL, NULL, 'CP-FORN-008', 'Farmácia Popular - Abril 2024', 'medicamentos', 'fornecedor', 18500.00, 0, 0, 0, 18500.00, 0, '2024-04-10', '2024-04-25', NULL, 'pendente', 0, 'transferencia', 1, 'Farmácia Popular LTDA', '66.777.888/0001-99', '341', '1717', '17171-7', 'corrente', NULL, 'Aguardando vencimento', 1),
(1, 47, NULL, NULL, 'CP-OPER-006', 'Segurança patrimonial - Maio 2024', 'outro', 'operacional', 4200.00, 0, 0, 0, 4200.00, 0, '2024-05-01', '2024-05-10', NULL, 'pendente', 0, 'boleto', 1, 'Segurança Total S/A', '77.888.999/0001-00', '104', '1818', '18181-8', 'corrente', NULL, 'Serviço de segurança', 1),
(1, 48, NULL, NULL, 'CP-FORN-009', 'Clínica Cardiologia - Março 2024', 'servicos_medicos', 'fornecedor', 15800.00, 0, 0, 0, 15800.00, 15800.00, '2024-03-15', '2024-03-30', '2024-03-28', 'pago', 0, 'pix', 1, 'Cardio Center LTDA', '88.999.000/0001-11', '033', '1919', '19191-9', 'corrente', '88.999.000/0001-11', 'Pagamento realizado', 1),
(1, NULL, 15, 15, 'CP-REST-004', 'Restituição erro cobrança', 'restituicao', 'restituicao_beneficiario', 200.00, 0, 0, 0, 200.00, 0, '2024-04-05', '2024-04-12', NULL, 'pendente', 0, 'pix', 1, 'Roberto Alves', '111.222.333-44', '001', '2020', '20202-0', 'corrente', '111.222.333-44', 'Erro identificado', 1),
(1, NULL, 20, 20, 'CP-REEMB-004', 'Reembolso cirurgia particular', 'servicos_medicos', 'reembolso_procedimento', 12000.00, 0, 0, 0, 12000.00, 0, '2024-04-01', '2024-04-20', NULL, 'pendente', 0, 'transferencia', 1, 'Juliana Ferreira', '222.333.444-55', '237', '2121', '21212-1', 'corrente', NULL, 'Em análise médica', 1);
