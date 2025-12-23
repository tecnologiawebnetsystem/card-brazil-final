-- =====================================================
-- SCRIPT DML: CONTAS A RECEBER - DADOS DE TESTE
-- Banco: MySQL 8.0+
-- =====================================================

USE cardbrazil;

-- Inserir 30 contas a receber com diferentes status e categorias
INSERT INTO contas_receber (
    id_administradora, beneficiario_id, proposta_id, contrato_id,
    numero_documento, descricao, categoria,
    valor_original, valor_multa, valor_juros, valor_desconto, valor_total, valor_pago,
    data_emissao, data_vencimento, data_pagamento,
    status, dias_atraso,
    forma_pagamento, codigo_barras, linha_digitavel,
    observacoes, created_by
) VALUES
-- Contas PAGAS
(1, 1, 1, 1, 'CR-2024-001', 'Mensalidade Janeiro 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 450.00, '2024-01-01', '2024-01-10', '2024-01-08', 'pago', 0, 'pix', NULL, NULL, 'Pagamento realizado via PIX', 1),
(1, 2, 2, 2, 'CR-2024-002', 'Taxa de Adesão', 'adesao', 850.00, 0, 0, 50.00, 800.00, 800.00, '2024-01-02', '2024-01-15', '2024-01-14', 'pago', 0, 'boleto', '23793381286008450000000000001', '23793.38128 60084.500000 00000.000018 1 98760000045000', 'Desconto de 50 reais aplicado', 1),
(1, 3, 3, 3, 'CR-2024-003', 'Mensalidade Fevereiro 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 450.00, '2024-02-01', '2024-02-10', '2024-02-09', 'pago', 0, 'cartao_credito', NULL, NULL, NULL, 1),
(1, 4, 4, 4, 'CR-2024-004', 'Coparticipação Consulta', 'coparticipacao', 80.00, 0, 0, 0, 80.00, 80.00, '2024-01-15', '2024-01-25', '2024-01-24', 'pago', 0, 'pix', NULL, NULL, NULL, 1),
(1, 5, 5, 5, 'CR-2024-005', 'Mensalidade Março 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 450.00, '2024-03-01', '2024-03-10', '2024-03-08', 'pago', 0, 'transferencia', NULL, NULL, NULL, 1),

-- Contas PENDENTES
(1, 6, 6, 6, 'CR-2024-006', 'Mensalidade Abril 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 0, '2024-04-01', '2024-04-10', NULL, 'pendente', 0, 'boleto', '23793381286008450000000000006', '23793.38128 60084.500000 00000.000068 6 98760000045000', 'Aguardando pagamento', 1),
(1, 7, 7, 7, 'CR-2024-007', 'Taxa Anual', 'taxa', 1200.00, 0, 0, 0, 1200.00, 0, '2024-01-05', '2024-04-15', NULL, 'pendente', 0, 'boleto', '23793381286012000000000000007', '23793.38128 60120.000000 00000.000075 7 98760000120000', NULL, 1),
(1, 8, 8, 8, 'CR-2024-008', 'Mensalidade Maio 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 0, '2024-05-01', '2024-05-10', NULL, 'pendente', 0, 'pix', NULL, NULL, 'PIX disponível', 1),
(1, 9, 9, 9, 'CR-2024-009', 'Coparticipação Exame', 'coparticipacao', 120.00, 0, 0, 0, 120.00, 0, '2024-04-20', '2024-05-05', NULL, 'pendente', 0, 'boleto', '23793381286001200000000000009', '23793.38128 60012.000000 00000.000093 9 98760000012000', NULL, 1),
(1, 10, 10, 10, 'CR-2024-010', 'Mensalidade Junho 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 0, '2024-06-01', '2024-06-10', NULL, 'pendente', 0, 'pix', NULL, NULL, NULL, 1),

-- Contas VENCIDAS (com multa e juros)
(1, 11, 11, 11, 'CR-2024-011', 'Mensalidade Dezembro 2023', 'mensalidade', 450.00, 9.00, 22.50, 0, 481.50, 0, '2023-12-01', '2023-12-10', NULL, 'vencido', 120, 'boleto', '23793381286004500000000000011', '23793.38128 60045.000000 00000.000119 1 98760000045000', 'Conta vencida há 120 dias', 1),
(1, 12, 12, 12, 'CR-2024-012', 'Mensalidade Janeiro 2024', 'mensalidade', 450.00, 9.00, 13.50, 0, 472.50, 0, '2024-01-01', '2024-01-10', NULL, 'vencido', 90, 'boleto', '23793381286004500000000000012', '23793.38128 60045.000000 00000.000127 2 98760000045000', 'Conta vencida há 90 dias', 1),
(1, 13, 13, 13, 'CR-2024-013', 'Coparticipação Internação', 'coparticipacao', 350.00, 7.00, 10.50, 0, 367.50, 0, '2024-02-01', '2024-02-15', NULL, 'vencido', 60, 'boleto', '23793381286003500000000000013', '23793.38128 60035.000000 00000.000135 3 98760000035000', 'Conta vencida há 60 dias', 1),
(1, 14, 14, 14, 'CR-2024-014', 'Mensalidade Fevereiro 2024', 'mensalidade', 450.00, 9.00, 9.00, 0, 468.00, 0, '2024-02-01', '2024-02-10', NULL, 'vencido', 60, 'pix', NULL, NULL, 'Conta vencida há 60 dias', 1),
(1, 15, 15, 15, 'CR-2024-015', 'Taxa de Manutenção', 'taxa', 200.00, 4.00, 6.00, 0, 210.00, 0, '2024-01-15', '2024-02-15', NULL, 'vencido', 75, 'boleto', '23793381286002000000000000015', '23793.38128 60020.000000 00000.000153 5 98760000020000', 'Conta vencida há 75 dias', 1),

-- Contas PARCIAIS
(1, 16, 16, 16, 'CR-2024-016', 'Mensalidade Março 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 200.00, '2024-03-01', '2024-03-10', NULL, 'parcial', 0, 'pix', NULL, NULL, 'Pagamento parcial de R$ 200', 1),
(1, 17, 17, 17, 'CR-2024-017', 'Taxa Anual 2024', 'taxa', 1500.00, 0, 0, 0, 1500.00, 750.00, '2024-01-10', '2024-04-10', NULL, 'parcial', 0, 'transferencia', NULL, NULL, 'Pagamento de 50% realizado', 1),
(1, 18, 18, 18, 'CR-2024-018', 'Coparticipação Cirurgia', 'coparticipacao', 800.00, 0, 0, 0, 800.00, 400.00, '2024-03-15', '2024-04-01', NULL, 'parcial', 0, 'cartao_credito', NULL, NULL, 'Pagamento parcial', 1),

-- Contas CANCELADAS
(1, 19, 19, 19, 'CR-2024-019', 'Mensalidade Abril 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 0, '2024-04-01', '2024-04-10', NULL, 'cancelado', 0, NULL, NULL, NULL, 'Cancelado por erro de emissão', 1),
(1, 20, 20, 20, 'CR-2024-020', 'Taxa de Adesão', 'adesao', 850.00, 0, 0, 0, 850.00, 0, '2024-03-20', '2024-04-05', NULL, 'cancelado', 0, NULL, NULL, NULL, 'Proposta cancelada', 1),

-- Mais contas variadas
(1, 21, 21, 21, 'CR-2024-021', 'Mensalidade Maio 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 0, '2024-05-01', '2024-05-10', NULL, 'pendente', 0, 'boleto', '23793381286004500000000000021', '23793.38128 60045.000000 00000.000211 1 98760000045000', NULL, 1),
(1, 22, 22, 22, 'CR-2024-022', 'Coparticipação Fisioterapia', 'coparticipacao', 60.00, 0, 0, 0, 60.00, 60.00, '2024-04-10', '2024-04-20', '2024-04-18', 'pago', 0, 'pix', NULL, NULL, NULL, 1),
(1, 23, 23, 23, 'CR-2024-023', 'Mensalidade Junho 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 0, '2024-06-01', '2024-06-10', NULL, 'pendente', 0, 'pix', NULL, NULL, NULL, 1),
(1, 24, 24, 24, 'CR-2024-024', 'Multa por Atraso', 'multa', 45.00, 0, 0, 0, 45.00, 0, '2024-03-15', '2024-03-25', NULL, 'vencido', 30, 'boleto', '23793381286000450000000000024', '23793.38128 60004.500000 00000.000248 4 98760000004500', 'Multa aplicada', 1),
(1, 25, 25, 25, 'CR-2024-025', 'Juros de Mora', 'juros', 22.50, 0, 0, 0, 22.50, 0, '2024-03-20', '2024-03-30', NULL, 'vencido', 25, 'pix', NULL, NULL, 'Juros calculados', 1),
(1, 26, 26, 26, 'CR-2024-026', 'Mensalidade Julho 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 0, '2024-07-01', '2024-07-10', NULL, 'pendente', 0, 'boleto', '23793381286004500000000000026', '23793.38128 60045.000000 00000.000266 6 98760000045000', NULL, 1),
(1, 27, 27, 27, 'CR-2024-027', 'Taxa de Emissão Carteirinha', 'taxa', 35.00, 0, 0, 0, 35.00, 35.00, '2024-03-05', '2024-03-15', '2024-03-14', 'pago', 0, 'dinheiro', NULL, NULL, NULL, 1),
(1, 28, 28, 28, 'CR-2024-028', 'Coparticipação Psicologia', 'coparticipacao', 90.00, 0, 0, 0, 90.00, 0, '2024-04-25', '2024-05-10', NULL, 'pendente', 0, 'pix', NULL, NULL, NULL, 1),
(1, 29, 29, 29, 'CR-2024-029', 'Mensalidade Agosto 2024', 'mensalidade', 450.00, 0, 0, 0, 450.00, 0, '2024-08-01', '2024-08-10', NULL, 'pendente', 0, 'boleto', '23793381286004500000000000029', '23793.38128 60045.000000 00000.000294 9 98760000045000', NULL, 1),
(1, 30, 30, 30, 'CR-2024-030', 'Taxa Administrativa', 'taxa', 150.00, 0, 0, 0, 150.00, 150.00, '2024-01-20', '2024-02-05', '2024-02-03', 'pago', 0, 'transferencia', NULL, NULL, NULL, 1);
