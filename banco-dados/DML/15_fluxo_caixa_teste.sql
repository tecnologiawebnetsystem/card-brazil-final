-- =====================================================
-- SCRIPT DML: FLUXO DE CAIXA - DADOS DE TESTE
-- Banco: MySQL 8.0+
-- =====================================================

USE cardbrazil;

-- Inserir 40 movimentações de fluxo de caixa (entradas e saídas)
INSERT INTO fluxo_caixa (
    id_administradora, conta_receber_id, conta_pagar_id, conta_bancaria_id,
    tipo, categoria, descricao, valor,
    data_movimentacao, data_competencia, status,
    conta_origem, conta_destino, observacoes, created_by
) VALUES
-- ENTRADAS REALIZADAS (vinculadas a contas a receber)
(1, 1, NULL, 1, 'entrada', 'Mensalidades', 'Recebimento mensalidade - João Silva', 450.00, '2024-01-08', '2024-01-01', 'realizado', 'PIX João Silva', 'Conta Corrente BB', 'Pagamento via PIX', 1),
(1, 2, NULL, 1, 'entrada', 'Adesões', 'Recebimento taxa de adesão', 800.00, '2024-01-14', '2024-01-02', 'realizado', 'Boleto Bancário', 'Conta Corrente BB', 'Desconto aplicado', 1),
(1, 3, NULL, 2, 'entrada', 'Mensalidades', 'Recebimento mensalidade - Maria Santos', 450.00, '2024-02-09', '2024-02-01', 'realizado', 'Cartão de Crédito', 'Conta Corrente Itaú', NULL, 1),
(1, 4, NULL, 1, 'entrada', 'Coparticipações', 'Coparticipação consulta', 80.00, '2024-01-24', '2024-01-15', 'realizado', 'PIX', 'Conta Corrente BB', NULL, 1),
(1, 5, NULL, 1, 'entrada', 'Mensalidades', 'Recebimento mensalidade - Pedro Costa', 450.00, '2024-03-08', '2024-03-01', 'realizado', 'Transferência', 'Conta Corrente BB', NULL, 1),
(1, 22, NULL, 2, 'entrada', 'Coparticipações', 'Coparticipação fisioterapia', 60.00, '2024-04-18', '2024-04-10', 'realizado', 'PIX', 'Conta Corrente Itaú', NULL, 1),
(1, 27, NULL, 1, 'entrada', 'Taxas', 'Taxa emissão carteirinha', 35.00, '2024-03-14', '2024-03-05', 'realizado', 'Dinheiro', 'Caixa', NULL, 1),
(1, 30, NULL, 1, 'entrada', 'Taxas', 'Taxa administrativa', 150.00, '2024-02-03', '2024-01-20', 'realizado', 'Transferência', 'Conta Corrente BB', NULL, 1),

-- ENTRADAS PREVISTAS
(1, 6, NULL, 1, 'entrada', 'Mensalidades', 'Previsão mensalidade Abril', 450.00, '2024-04-10', '2024-04-01', 'previsto', NULL, 'Conta Corrente BB', 'Aguardando pagamento', 1),
(1, 7, NULL, 1, 'entrada', 'Taxas', 'Previsão taxa anual', 1200.00, '2024-04-15', '2024-01-05', 'previsto', NULL, 'Conta Corrente BB', NULL, 1),
(1, 8, NULL, 2, 'entrada', 'Mensalidades', 'Previsão mensalidade Maio', 450.00, '2024-05-10', '2024-05-01', 'previsto', NULL, 'Conta Corrente Itaú', NULL, 1),
(1, 9, NULL, 1, 'entrada', 'Coparticipações', 'Previsão coparticipação exame', 120.00, '2024-05-05', '2024-04-20', 'previsto', NULL, 'Conta Corrente BB', NULL, 1),
(1, 10, NULL, 1, 'entrada', 'Mensalidades', 'Previsão mensalidade Junho', 450.00, '2024-06-10', '2024-06-01', 'previsto', NULL, 'Conta Corrente BB', NULL, 1),
(1, 21, NULL, 1, 'entrada', 'Mensalidades', 'Previsão mensalidade Maio', 450.00, '2024-05-10', '2024-05-01', 'previsto', NULL, 'Conta Corrente BB', NULL, 1),
(1, 23, NULL, 2, 'entrada', 'Mensalidades', 'Previsão mensalidade Junho', 450.00, '2024-06-10', '2024-06-01', 'previsto', NULL, 'Conta Corrente Itaú', NULL, 1),
(1, 26, NULL, 1, 'entrada', 'Mensalidades', 'Previsão mensalidade Julho', 450.00, '2024-07-10', '2024-07-01', 'previsto', NULL, 'Conta Corrente BB', NULL, 1),
(1, 28, NULL, 2, 'entrada', 'Coparticipações', 'Previsão coparticipação psicologia', 90.00, '2024-05-10', '2024-04-25', 'previsto', NULL, 'Conta Corrente Itaú', NULL, 1),
(1, 29, NULL, 1, 'entrada', 'Mensalidades', 'Previsão mensalidade Agosto', 450.00, '2024-08-10', '2024-08-01', 'previsto', NULL, 'Conta Corrente BB', NULL, 1),

-- SAÍDAS REALIZADAS (vinculadas a contas a pagar)
(1, NULL, 1, 1, 'saida', 'Restituições', 'Restituição pagamento duplicado', 450.00, '2024-01-19', '2024-01-15', 'realizado', 'Conta Corrente BB', 'PIX João Silva', 'Restituição processada', 1),
(1, NULL, 4, 1, 'saida', 'Reembolsos', 'Reembolso consulta particular', 250.00, '2024-01-28', '2024-01-20', 'realizado', 'Conta Corrente BB', 'Transferência Maria Santos', 'Reembolso aprovado', 1),
(1, NULL, 6, 1, 'saida', 'Reembolsos', 'Reembolso medicamentos', 520.00, '2024-03-08', '2024-03-01', 'realizado', 'Conta Corrente BB', 'Transferência Fernanda Lima', NULL, 1),
(1, NULL, 7, 1, 'saida', 'Fornecedores', 'Pagamento Hospital Central', 45000.00, '2024-02-08', '2024-01-25', 'realizado', 'Conta Corrente BB', 'Hospital Central', 'Internações Janeiro', 1),
(1, NULL, 10, 1, 'saida', 'Fornecedores', 'Pagamento Farmácia Saúde', 15600.00, '2024-02-14', '2024-01-30', 'realizado', 'Conta Corrente BB', 'PIX Farmácia Saúde', 'Medicamentos Janeiro', 1),
(1, NULL, 12, 1, 'saida', 'Operacional', 'Aluguel escritório Janeiro', 8500.00, '2024-01-09', '2024-01-05', 'realizado', 'Conta Corrente BB', 'Imobiliária Prime', NULL, 1),
(1, NULL, 13, 2, 'saida', 'Operacional', 'Energia elétrica Fevereiro', 2300.00, '2024-02-23', '2024-02-15', 'realizado', 'Conta Corrente Itaú', 'Companhia de Energia', NULL, 1),
(1, NULL, 15, 1, 'saida', 'Operacional', 'Material de escritório', 850.00, '2024-03-04', '2024-02-20', 'realizado', 'Cartão Corporativo', 'Papelaria Central', NULL, 1),
(1, NULL, 17, 1, 'saida', 'Impostos', 'IRPJ Janeiro', 12000.00, '2024-01-30', '2024-01-20', 'realizado', 'Conta Corrente BB', 'Receita Federal', NULL, 1),
(1, NULL, 18, 1, 'saida', 'Impostos', 'CSLL Fevereiro', 8500.00, '2024-02-28', '2024-02-20', 'realizado', 'Conta Corrente BB', 'Receita Federal', NULL, 1),
(1, NULL, 48, 2, 'saida', 'Fornecedores', 'Pagamento Clínica Cardiologia', 15800.00, '2024-03-28', '2024-03-15', 'realizado', 'Conta Corrente Itaú', 'PIX Cardio Center', NULL, 1),

-- SAÍDAS PREVISTAS
(1, NULL, 2, 1, 'saida', 'Restituições', 'Previsão restituição Pedro Costa', 450.00, '2024-02-15', '2024-02-10', 'previsto', 'Conta Corrente BB', 'Transferência', 'Aguardando processamento', 1),
(1, NULL, 3, 1, 'saida', 'Restituições', 'Previsão restituição Ana Santos', 850.00, '2024-03-12', '2024-03-05', 'previsto', 'Conta Corrente BB', 'PIX', NULL, 1),
(1, NULL, 5, 1, 'saida', 'Reembolsos', 'Previsão reembolso exames', 380.00, '2024-02-25', '2024-02-15', 'previsto', 'Conta Corrente BB', 'PIX Carlos Oliveira', NULL, 1),
(1, NULL, 8, 1, 'saida', 'Fornecedores', 'Previsão Clínica São Paulo', 12500.00, '2024-03-15', '2024-02-28', 'previsto', 'Conta Corrente BB', 'Clínica São Paulo', 'Consultas Fevereiro', 1),
(1, NULL, 9, 2, 'saida', 'Fornecedores', 'Previsão Laboratório Central', 8900.00, '2024-04-10', '2024-03-25', 'previsto', 'Conta Corrente Itaú', 'Laboratório Central', 'Exames Março', 1),
(1, NULL, 11, 1, 'saida', 'Fornecedores', 'Previsão Hospital Santa Casa', 78000.00, '2024-03-20', '2024-02-28', 'previsto', 'Conta Corrente BB', 'Santa Casa', 'Cirurgias Fevereiro', 1),
(1, NULL, 14, 2, 'saida', 'Operacional', 'Previsão internet/telefonia', 1200.00, '2024-03-20', '2024-03-10', 'previsto', 'Conta Corrente Itaú', 'Telecom Brasil', NULL, 1),
(1, NULL, 16, 1, 'saida', 'Operacional', 'Previsão manutenção sistema', 3500.00, '2024-04-15', '2024-04-01', 'previsto', 'Conta Corrente BB', 'PIX TechSolutions', NULL, 1),
(1, NULL, 19, 1, 'saida', 'Impostos', 'Previsão ISS Março', 4200.00, '2024-03-31', '2024-03-15', 'previsto', 'Conta Corrente BB', 'Prefeitura', NULL, 1),
(1, NULL, 25, 1, 'saida', 'Fornecedores', 'Previsão Hospital Regional', 52000.00, '2024-04-20', '2024-04-01', 'previsto', 'Conta Corrente BB', 'Hospital Regional', 'Programado', 1);
