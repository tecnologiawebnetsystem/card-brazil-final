-- =============================================================================
-- CARD BRAZIL - INSERTS INICIAIS DO BANCO DE DADOS MySQL
-- Dados iniciais para funcionamento do sistema
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- 1. CONFIGURACOES DO SISTEMA
-- =============================================================================

INSERT INTO `configuracoes` (`chave`, `valor`, `tipo`, `descricao`, `grupo`) VALUES
('empresa_nome', 'Talent Health Administradora', 'string', 'Nome da empresa', 'geral'),
('empresa_cnpj', '00.000.000/0001-00', 'string', 'CNPJ da empresa', 'geral'),
('empresa_endereco', 'Rua Exemplo, 123 - Centro - Sao Paulo/SP', 'string', 'Endereco da empresa', 'geral'),
('empresa_telefone', '(11) 3000-0000', 'string', 'Telefone da empresa', 'geral'),
('empresa_email', 'contato@talenthealth.com.br', 'string', 'Email da empresa', 'geral'),
('sistema_versao', '1.0.0', 'string', 'Versao do sistema', 'sistema'),
('dias_carencia_urgencia', '24', 'number', 'Dias de carencia para urgencia/emergencia', 'carencias'),
('dias_carencia_consultas', '30', 'number', 'Dias de carencia para consultas', 'carencias'),
('dias_carencia_exames', '180', 'number', 'Dias de carencia para exames', 'carencias'),
('dias_carencia_internacao', '180', 'number', 'Dias de carencia para internacao', 'carencias'),
('dias_carencia_parto', '300', 'number', 'Dias de carencia para parto', 'carencias'),
('multa_atraso_percentual', '2.00', 'number', 'Percentual de multa por atraso', 'cobranca'),
('juros_dia_percentual', '0.033', 'number', 'Percentual de juros ao dia', 'cobranca'),
('dias_tolerancia_pagamento', '3', 'number', 'Dias de tolerancia apos vencimento', 'cobranca'),
('dias_suspensao_inadimplencia', '60', 'number', 'Dias para suspensao por inadimplencia', 'cobranca'),
('dias_cancelamento_inadimplencia', '90', 'number', 'Dias para cancelamento por inadimplencia', 'cobranca'),
('email_smtp_host', 'smtp.gmail.com', 'string', 'Host do servidor SMTP', 'email'),
('email_smtp_porta', '587', 'number', 'Porta do servidor SMTP', 'email'),
('email_remetente', 'noreply@talenthealth.com.br', 'string', 'Email remetente', 'email'),
('sms_habilitado', 'false', 'boolean', 'SMS habilitado', 'sms'),
('timeout_sessao_minutos', '30', 'number', 'Tempo de timeout da sessao em minutos', 'seguranca'),
('tentativas_login_max', '5', 'number', 'Numero maximo de tentativas de login', 'seguranca'),
('tempo_bloqueio_minutos', '15', 'number', 'Tempo de bloqueio apos tentativas excedidas', 'seguranca');

-- =============================================================================
-- 2. PERMISSOES DO SISTEMA
-- =============================================================================

INSERT INTO `permissoes` (`codigo`, `descricao`, `modulo`) VALUES
-- Dashboard
('dashboard.visualizar', 'Visualizar dashboard', 'dashboard'),
('dashboard.exportar', 'Exportar dados do dashboard', 'dashboard'),

-- Beneficiarios
('beneficiarios.visualizar', 'Visualizar beneficiarios', 'beneficiarios'),
('beneficiarios.criar', 'Criar beneficiarios', 'beneficiarios'),
('beneficiarios.editar', 'Editar beneficiarios', 'beneficiarios'),
('beneficiarios.excluir', 'Excluir beneficiarios', 'beneficiarios'),
('beneficiarios.exportar', 'Exportar beneficiarios', 'beneficiarios'),

-- Propostas
('propostas.visualizar', 'Visualizar propostas', 'propostas'),
('propostas.criar', 'Criar propostas', 'propostas'),
('propostas.editar', 'Editar propostas', 'propostas'),
('propostas.aprovar', 'Aprovar propostas', 'propostas'),
('propostas.recusar', 'Recusar propostas', 'propostas'),

-- Cobranca
('cobranca.visualizar', 'Visualizar cobrancas', 'cobranca'),
('cobranca.gerar_boletos', 'Gerar boletos', 'cobranca'),
('cobranca.baixar_pagamento', 'Baixar pagamentos', 'cobranca'),
('cobranca.negociar', 'Negociar debitos', 'cobranca'),

-- Financeiro
('financeiro.visualizar', 'Visualizar financeiro', 'financeiro'),
('financeiro.lancamentos', 'Criar lancamentos', 'financeiro'),
('financeiro.conciliacao', 'Realizar conciliacao', 'financeiro'),

-- Contabil
('contabil.visualizar', 'Visualizar contabilidade', 'contabil'),
('contabil.lancamentos', 'Criar lancamentos contabeis', 'contabil'),
('contabil.relatorios', 'Gerar relatorios contabeis', 'contabil'),

-- Cadastros
('cadastros.operadoras', 'Gerenciar operadoras', 'cadastros'),
('cadastros.administradoras', 'Gerenciar administradoras', 'cadastros'),
('cadastros.corretores', 'Gerenciar corretores', 'cadastros'),
('cadastros.estipulantes', 'Gerenciar estipulantes', 'cadastros'),
('cadastros.planos', 'Gerenciar planos', 'cadastros'),
('cadastros.produtos', 'Gerenciar produtos', 'cadastros'),

-- Relatorios
('relatorios.visualizar', 'Visualizar relatorios', 'relatorios'),
('relatorios.gerar', 'Gerar relatorios', 'relatorios'),
('relatorios.exportar', 'Exportar relatorios', 'relatorios'),

-- Configuracoes
('configuracoes.visualizar', 'Visualizar configuracoes', 'configuracoes'),
('configuracoes.editar', 'Editar configuracoes', 'configuracoes'),
('configuracoes.usuarios', 'Gerenciar usuarios', 'configuracoes'),
('configuracoes.permissoes', 'Gerenciar permissoes', 'configuracoes'),

-- Auditoria
('auditoria.visualizar', 'Visualizar auditoria', 'auditoria'),
('auditoria.exportar', 'Exportar auditoria', 'auditoria'),

-- ANS
('ans.visualizar', 'Visualizar ANS', 'ans'),
('ans.gerar', 'Gerar arquivos ANS', 'ans'),
('ans.enviar', 'Enviar arquivos ANS', 'ans'),

-- Database Manager
('database.visualizar', 'Visualizar banco de dados', 'database'),
('database.executar', 'Executar queries', 'database');

-- =============================================================================
-- 3. USUARIO ADMINISTRADOR PADRAO
-- =============================================================================

-- Senha padrao: Admin@123 (hash bcrypt)
INSERT INTO `usuarios` (`nome`, `email`, `senha`, `perfil`, `departamento`, `status`, `trocar_senha`) VALUES
('Administrador Sistema', 'admin@talenthealth.com.br', '$2b$10$rOzJqQZQmOYQZR5JqQZQme.QZQmOYQZR5JqQZQmOYQZR5JqQZQmO', 'administrador', 'TI', 'ativo', 1);

-- Atribuir todas as permissoes ao administrador
INSERT INTO `usuario_permissoes` (`usuario_id`, `permissao_id`)
SELECT 1, id FROM `permissoes`;

-- =============================================================================
-- 4. PLANO DE CONTAS BASICO
-- =============================================================================

INSERT INTO `plano_contas` (`codigo`, `descricao`, `tipo`, `natureza`, `nivel`, `conta_pai_id`, `aceita_lancamento`) VALUES
-- ATIVO
('1', 'ATIVO', 'ativo', 'devedora', 1, NULL, 0),
('1.1', 'ATIVO CIRCULANTE', 'ativo', 'devedora', 2, 1, 0),
('1.1.1', 'DISPONIVEL', 'ativo', 'devedora', 3, 2, 0),
('1.1.1.01', 'Caixa Geral', 'ativo', 'devedora', 4, 3, 1),
('1.1.1.02', 'Bancos Conta Movimento', 'ativo', 'devedora', 4, 3, 1),
('1.1.1.03', 'Aplicacoes Financeiras', 'ativo', 'devedora', 4, 3, 1),
('1.1.2', 'CREDITOS', 'ativo', 'devedora', 3, 2, 0),
('1.1.2.01', 'Clientes a Receber', 'ativo', 'devedora', 4, 7, 1),
('1.1.2.02', 'Mensalidades a Receber', 'ativo', 'devedora', 4, 7, 1),
('1.1.2.03', 'Comissoes a Receber', 'ativo', 'devedora', 4, 7, 1),
('1.1.2.04', '(-) Provisao para Devedores Duvidosos', 'ativo', 'credora', 4, 7, 1),
('1.2', 'ATIVO NAO CIRCULANTE', 'ativo', 'devedora', 2, 1, 0),
('1.2.1', 'IMOBILIZADO', 'ativo', 'devedora', 3, 12, 0),
('1.2.1.01', 'Moveis e Utensilios', 'ativo', 'devedora', 4, 13, 1),
('1.2.1.02', 'Equipamentos de Informatica', 'ativo', 'devedora', 4, 13, 1),
('1.2.1.03', 'Veiculos', 'ativo', 'devedora', 4, 13, 1),
('1.2.1.04', '(-) Depreciacao Acumulada', 'ativo', 'credora', 4, 13, 1),

-- PASSIVO
('2', 'PASSIVO', 'passivo', 'credora', 1, NULL, 0),
('2.1', 'PASSIVO CIRCULANTE', 'passivo', 'credora', 2, 18, 0),
('2.1.1', 'OBRIGACOES A CURTO PRAZO', 'passivo', 'credora', 3, 19, 0),
('2.1.1.01', 'Fornecedores', 'passivo', 'credora', 4, 20, 1),
('2.1.1.02', 'Salarios a Pagar', 'passivo', 'credora', 4, 20, 1),
('2.1.1.03', 'Encargos Sociais a Recolher', 'passivo', 'credora', 4, 20, 1),
('2.1.1.04', 'Impostos a Recolher', 'passivo', 'credora', 4, 20, 1),
('2.1.1.05', 'Comissoes a Pagar', 'passivo', 'credora', 4, 20, 1),
('2.1.2', 'PROVISOES', 'passivo', 'credora', 3, 19, 0),
('2.1.2.01', 'Provisao para Ferias', 'passivo', 'credora', 4, 26, 1),
('2.1.2.02', 'Provisao para 13o Salario', 'passivo', 'credora', 4, 26, 1),
('2.2', 'PASSIVO NAO CIRCULANTE', 'passivo', 'credora', 2, 18, 0),
('2.2.1', 'OBRIGACOES A LONGO PRAZO', 'passivo', 'credora', 3, 29, 0),
('2.2.1.01', 'Financiamentos', 'passivo', 'credora', 4, 30, 1),

-- PATRIMONIO LIQUIDO
('3', 'PATRIMONIO LIQUIDO', 'patrimonio', 'credora', 1, NULL, 0),
('3.1', 'CAPITAL SOCIAL', 'patrimonio', 'credora', 2, 32, 0),
('3.1.1', 'Capital Subscrito', 'patrimonio', 'credora', 3, 33, 1),
('3.1.2', '(-) Capital a Integralizar', 'patrimonio', 'devedora', 3, 33, 1),
('3.2', 'RESERVAS', 'patrimonio', 'credora', 2, 32, 0),
('3.2.1', 'Reserva Legal', 'patrimonio', 'credora', 3, 36, 1),
('3.2.2', 'Reserva de Lucros', 'patrimonio', 'credora', 3, 36, 1),
('3.3', 'LUCROS OU PREJUIZOS ACUMULADOS', 'patrimonio', 'credora', 2, 32, 0),
('3.3.1', 'Lucros Acumulados', 'patrimonio', 'credora', 3, 39, 1),
('3.3.2', 'Prejuizos Acumulados', 'patrimonio', 'devedora', 3, 39, 1),

-- RECEITAS
('4', 'RECEITAS', 'receita', 'credora', 1, NULL, 0),
('4.1', 'RECEITAS OPERACIONAIS', 'receita', 'credora', 2, 42, 0),
('4.1.1', 'RECEITAS DE SERVICOS', 'receita', 'credora', 3, 43, 0),
('4.1.1.01', 'Receita de Mensalidades', 'receita', 'credora', 4, 44, 1),
('4.1.1.02', 'Receita de Taxa Administrativa', 'receita', 'credora', 4, 44, 1),
('4.1.1.03', 'Receita de Coparticipacao', 'receita', 'credora', 4, 44, 1),
('4.1.1.04', 'Receita de Segunda Via Carteirinha', 'receita', 'credora', 4, 44, 1),
('4.1.2', 'OUTRAS RECEITAS OPERACIONAIS', 'receita', 'credora', 3, 43, 0),
('4.1.2.01', 'Receita de Juros', 'receita', 'credora', 4, 49, 1),
('4.1.2.02', 'Receita de Multas', 'receita', 'credora', 4, 49, 1),
('4.1.2.03', 'Descontos Obtidos', 'receita', 'credora', 4, 49, 1),
('4.2', 'RECEITAS NAO OPERACIONAIS', 'receita', 'credora', 2, 42, 0),
('4.2.1', 'Receitas Financeiras', 'receita', 'credora', 3, 53, 1),
('4.2.2', 'Outras Receitas', 'receita', 'credora', 3, 53, 1),

-- DESPESAS
('5', 'DESPESAS', 'despesa', 'devedora', 1, NULL, 0),
('5.1', 'DESPESAS OPERACIONAIS', 'despesa', 'devedora', 2, 56, 0),
('5.1.1', 'DESPESAS ADMINISTRATIVAS', 'despesa', 'devedora', 3, 57, 0),
('5.1.1.01', 'Salarios e Ordenados', 'despesa', 'devedora', 4, 58, 1),
('5.1.1.02', 'Encargos Sociais', 'despesa', 'devedora', 4, 58, 1),
('5.1.1.03', 'Beneficios a Funcionarios', 'despesa', 'devedora', 4, 58, 1),
('5.1.1.04', 'Aluguel', 'despesa', 'devedora', 4, 58, 1),
('5.1.1.05', 'Energia Eletrica', 'despesa', 'devedora', 4, 58, 1),
('5.1.1.06', 'Agua e Esgoto', 'despesa', 'devedora', 4, 58, 1),
('5.1.1.07', 'Telefone e Internet', 'despesa', 'devedora', 4, 58, 1),
('5.1.1.08', 'Material de Escritorio', 'despesa', 'devedora', 4, 58, 1),
('5.1.1.09', 'Servicos de Terceiros', 'despesa', 'devedora', 4, 58, 1),
('5.1.1.10', 'Depreciacao', 'despesa', 'devedora', 4, 58, 1),
('5.1.2', 'DESPESAS COMERCIAIS', 'despesa', 'devedora', 3, 57, 0),
('5.1.2.01', 'Comissoes sobre Vendas', 'despesa', 'devedora', 4, 69, 1),
('5.1.2.02', 'Propaganda e Publicidade', 'despesa', 'devedora', 4, 69, 1),
('5.1.2.03', 'Brindes e Eventos', 'despesa', 'devedora', 4, 69, 1),
('5.1.3', 'DESPESAS FINANCEIRAS', 'despesa', 'devedora', 3, 57, 0),
('5.1.3.01', 'Juros Pagos', 'despesa', 'devedora', 4, 73, 1),
('5.1.3.02', 'Descontos Concedidos', 'despesa', 'devedora', 4, 73, 1),
('5.1.3.03', 'Tarifas Bancarias', 'despesa', 'devedora', 4, 73, 1),
('5.1.3.04', 'IOF', 'despesa', 'devedora', 4, 73, 1),
('5.1.4', 'DESPESAS TRIBUTARIAS', 'despesa', 'devedora', 3, 57, 0),
('5.1.4.01', 'PIS', 'despesa', 'devedora', 4, 78, 1),
('5.1.4.02', 'COFINS', 'despesa', 'devedora', 4, 78, 1),
('5.1.4.03', 'IRPJ', 'despesa', 'devedora', 4, 78, 1),
('5.1.4.04', 'CSLL', 'despesa', 'devedora', 4, 78, 1),
('5.1.4.05', 'ISS', 'despesa', 'devedora', 4, 78, 1),
('5.2', 'OUTRAS DESPESAS', 'despesa', 'devedora', 2, 56, 0),
('5.2.1', 'Despesas Nao Operacionais', 'despesa', 'devedora', 3, 84, 1),
('5.2.2', 'Perdas Diversas', 'despesa', 'devedora', 3, 84, 1);

-- =============================================================================
-- 5. FERIADOS NACIONAIS
-- =============================================================================

INSERT INTO `feriados` (`data`, `descricao`, `tipo`, `recorrente`) VALUES
('2024-01-01', 'Confraternizacao Universal', 'nacional', 1),
('2024-02-12', 'Carnaval', 'nacional', 0),
('2024-02-13', 'Carnaval', 'nacional', 0),
('2024-03-29', 'Sexta-feira Santa', 'nacional', 0),
('2024-04-21', 'Tiradentes', 'nacional', 1),
('2024-05-01', 'Dia do Trabalho', 'nacional', 1),
('2024-05-30', 'Corpus Christi', 'nacional', 0),
('2024-09-07', 'Independencia do Brasil', 'nacional', 1),
('2024-10-12', 'Nossa Senhora Aparecida', 'nacional', 1),
('2024-11-02', 'Finados', 'nacional', 1),
('2024-11-15', 'Proclamacao da Republica', 'nacional', 1),
('2024-12-25', 'Natal', 'nacional', 1),
('2025-01-01', 'Confraternizacao Universal', 'nacional', 1),
('2025-03-03', 'Carnaval', 'nacional', 0),
('2025-03-04', 'Carnaval', 'nacional', 0),
('2025-04-18', 'Sexta-feira Santa', 'nacional', 0),
('2025-04-21', 'Tiradentes', 'nacional', 1),
('2025-05-01', 'Dia do Trabalho', 'nacional', 1),
('2025-06-19', 'Corpus Christi', 'nacional', 0),
('2025-09-07', 'Independencia do Brasil', 'nacional', 1),
('2025-10-12', 'Nossa Senhora Aparecida', 'nacional', 1),
('2025-11-02', 'Finados', 'nacional', 1),
('2025-11-15', 'Proclamacao da Republica', 'nacional', 1),
('2025-12-25', 'Natal', 'nacional', 1);

-- =============================================================================
-- 6. DADOS DE EXEMPLO - PESSOAS
-- =============================================================================

-- Pessoas Juridicas (Operadoras, Administradoras, etc)
INSERT INTO `pessoas` (`tipo_pessoa`, `razao_social`, `nome_fantasia`, `cnpj`, `inscricao_estadual`, `inscricao_municipal`, `telefone`, `email`, `status`) VALUES
('juridica', 'Talent Health Administradora de Beneficios Ltda', 'Talent Health', '12.345.678/0001-90', 'ISENTO', '123456', '(11) 3000-0000', 'contato@talenthealth.com.br', 'ativo'),
('juridica', 'Unimed Sao Paulo Cooperativa de Trabalho Medico', 'Unimed SP', '43.202.472/0001-30', 'ISENTO', '789012', '(11) 3299-3000', 'contato@unimedsp.com.br', 'ativo'),
('juridica', 'Sul America Companhia de Seguro Saude', 'SulAmerica Saude', '01.685.053/0001-56', 'ISENTO', '345678', '(11) 3003-7220', 'contato@sulamerica.com.br', 'ativo'),
('juridica', 'Bradesco Saude S.A.', 'Bradesco Saude', '92.693.118/0001-60', 'ISENTO', '901234', '(11) 4002-0022', 'contato@bradescosaude.com.br', 'ativo'),
('juridica', 'Empresa ABC Comercio e Servicos Ltda', 'ABC Comercio', '98.765.432/0001-10', '123456789', '567890', '(11) 4000-1000', 'contato@abccomercio.com.br', 'ativo'),
('juridica', 'Industria XYZ S.A.', 'XYZ Industria', '11.222.333/0001-44', '987654321', '234567', '(11) 4000-2000', 'contato@xyzindustria.com.br', 'ativo');

-- Pessoas Fisicas (Corretores, Beneficiarios, etc)
INSERT INTO `pessoas` (`tipo_pessoa`, `nome`, `cpf`, `rg`, `data_nascimento`, `sexo`, `estado_civil`, `telefone`, `celular`, `email`, `status`) VALUES
('fisica', 'Carlos Alberto Silva', '123.456.789-00', '12.345.678-9', '1980-05-15', 'M', 'casado', '(11) 3500-0001', '(11) 99000-0001', 'carlos.silva@email.com', 'ativo'),
('fisica', 'Maria Santos Oliveira', '234.567.890-11', '23.456.789-0', '1985-08-22', 'F', 'solteiro', '(11) 3500-0002', '(11) 99000-0002', 'maria.oliveira@email.com', 'ativo'),
('fisica', 'Jose Roberto Costa', '345.678.901-22', '34.567.890-1', '1975-03-10', 'M', 'casado', '(11) 3500-0003', '(11) 99000-0003', 'jose.costa@email.com', 'ativo'),
('fisica', 'Ana Paula Ferreira', '456.789.012-33', '45.678.901-2', '1990-11-28', 'F', 'casado', '(11) 3500-0004', '(11) 99000-0004', 'ana.ferreira@email.com', 'ativo'),
('fisica', 'Pedro Henrique Lima', '567.890.123-44', '56.789.012-3', '1988-07-05', 'M', 'solteiro', '(11) 3500-0005', '(11) 99000-0005', 'pedro.lima@email.com', 'ativo'),
('fisica', 'Fernanda Costa Silva', '678.901.234-55', '67.890.123-4', '1992-01-18', 'F', 'solteiro', '(11) 3500-0006', '(11) 99000-0006', 'fernanda.costa@email.com', 'ativo'),
('fisica', 'Lucas Oliveira Santos', '789.012.345-66', '78.901.234-5', '1995-09-12', 'M', 'solteiro', '(11) 3500-0007', '(11) 99000-0007', 'lucas.santos@email.com', 'ativo'),
('fisica', 'Julia Martins Rodrigues', '890.123.456-77', '89.012.345-6', '1982-04-25', 'F', 'casado', '(11) 3500-0008', '(11) 99000-0008', 'julia.martins@email.com', 'ativo');

-- =============================================================================
-- 7. DADOS DE EXEMPLO - ENDERECOS
-- =============================================================================

INSERT INTO `enderecos` (`pessoa_id`, `tipo`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `estado`, `principal`) VALUES
(1, 'comercial', '01310-100', 'Av. Paulista', '1000', 'Sala 1001', 'Bela Vista', 'Sao Paulo', 'SP', 1),
(2, 'comercial', '01310-200', 'Av. Paulista', '2000', '15o andar', 'Bela Vista', 'Sao Paulo', 'SP', 1),
(3, 'comercial', '04543-011', 'Rua Verbo Divino', '1488', NULL, 'Chacara Santo Antonio', 'Sao Paulo', 'SP', 1),
(4, 'comercial', '01310-300', 'Av. Paulista', '3000', NULL, 'Bela Vista', 'Sao Paulo', 'SP', 1),
(5, 'comercial', '04551-060', 'Av. Engenheiro Luis Carlos Berrini', '500', 'Conj 101', 'Cidade Moncoes', 'Sao Paulo', 'SP', 1),
(6, 'comercial', '06454-000', 'Av. Tamboré', '1180', NULL, 'Tambore', 'Barueri', 'SP', 1),
(7, 'residencial', '05425-070', 'Rua Cerro Cora', '400', 'Apto 42', 'Alto de Pinheiros', 'Sao Paulo', 'SP', 1),
(8, 'residencial', '04552-000', 'Rua Joaquim Floriano', '200', 'Apto 85', 'Itaim Bibi', 'Sao Paulo', 'SP', 1),
(9, 'residencial', '01414-001', 'Rua da Consolacao', '1500', 'Casa', 'Consolacao', 'Sao Paulo', 'SP', 1),
(10, 'residencial', '04101-000', 'Av. Brigadeiro Luis Antonio', '800', 'Apto 33', 'Bela Vista', 'Sao Paulo', 'SP', 1);

-- =============================================================================
-- 8. DADOS DE EXEMPLO - DADOS BANCARIOS
-- =============================================================================

INSERT INTO `dados_bancarios` (`pessoa_id`, `banco`, `codigo_banco`, `agencia`, `tipo_conta`, `conta`, `digito_conta`, `pix_tipo`, `pix_chave`, `principal`) VALUES
(1, 'Banco do Brasil', '001', '1234', 'corrente', '12345', '6', 'cnpj', '12345678000190', 1),
(2, 'Itau Unibanco', '341', '0001', 'corrente', '98765', '4', 'cnpj', '43202472000130', 1),
(3, 'Bradesco', '237', '0500', 'corrente', '54321', '8', 'cnpj', '01685053000156', 1),
(5, 'Santander', '033', '3500', 'corrente', '13579', '2', 'cnpj', '98765432000110', 1),
(7, 'Banco do Brasil', '001', '5678', 'corrente', '24680', '1', 'cpf', '12345678900', 1);

-- =============================================================================
-- 9. DADOS DE EXEMPLO - OPERADORAS E ADMINISTRADORAS
-- =============================================================================

INSERT INTO `operadoras` (`pessoa_id`, `natureza_operadora`, `registro_ans`, `modalidade`, `segmento`, `porte`, `ativo`) VALUES
(2, 'Cooperativa Medica', '301337', 'Cooperativa Medica', 'Hospitalar com Obstetrícia', 'grande', 1),
(3, 'Seguradora Especializada em Saude', '006246', 'Seguradora', 'Referencia', 'grande', 1),
(4, 'Seguradora Especializada em Saude', '005711', 'Seguradora', 'Referencia', 'grande', 1);

INSERT INTO `administradoras` (`pessoa_id`, `registro_ans`, `tipo_administradora`, `ativo`) VALUES
(1, '123456', 'Administradora de Beneficios', 1);

-- =============================================================================
-- 10. DADOS DE EXEMPLO - CORRETORES
-- =============================================================================

INSERT INTO `corretores` (`pessoa_id`, `registro_susep`, `comissao_percentual`, `situacao`) VALUES
(7, 'SUSEP-123456', 5.00, 'ativo'),
(8, 'SUSEP-234567', 4.50, 'ativo');

-- =============================================================================
-- 11. DADOS DE EXEMPLO - ESTIPULANTES
-- =============================================================================

INSERT INTO `estipulantes` (`pessoa_id`, `operadora_id`, `codigo_estipulante`, `data_contrato`, `situacao`) VALUES
(5, 1, 'EST001', '2023-01-01', 'ativo'),
(6, 1, 'EST002', '2023-06-15', 'ativo');

-- =============================================================================
-- 12. DADOS DE EXEMPLO - PLANOS
-- =============================================================================

INSERT INTO `planos` (`operadora_id`, `codigo_plano`, `nome`, `registro_ans`, `tipo_contratacao`, `segmentacao`, `abrangencia`, `acomodacao`, `coparticipacao`, `valor_base`, `ativo`) VALUES
(1, 'UNIMED-BASIC', 'Unimed Basico Nacional', '400001', 'coletivo_empresarial', 'ambulatorial', 'nacional', NULL, 1, 350.00, 1),
(1, 'UNIMED-INTER', 'Unimed Intermediario', '400002', 'coletivo_empresarial', 'hospitalar', 'nacional', 'enfermaria', 1, 550.00, 1),
(1, 'UNIMED-PLUS', 'Unimed Plus Executivo', '400003', 'coletivo_empresarial', 'hospitalar_obstetrico', 'nacional', 'apartamento', 0, 850.00, 1),
(2, 'SULA-CLASSICO', 'SulAmerica Classico', '500001', 'coletivo_empresarial', 'referencia', 'nacional', 'apartamento', 0, 1200.00, 1),
(2, 'SULA-ESPECIAL', 'SulAmerica Especial', '500002', 'coletivo_empresarial', 'referencia', 'nacional', 'apartamento', 0, 1800.00, 1),
(3, 'BRAD-NACIONAL', 'Bradesco Saude Nacional', '600001', 'coletivo_empresarial', 'referencia', 'nacional', 'apartamento', 0, 1500.00, 1);

-- =============================================================================
-- 13. DADOS DE EXEMPLO - FAIXAS ETARIAS DOS PLANOS
-- =============================================================================

INSERT INTO `planos_faixas_etarias` (`plano_id`, `idade_minima`, `idade_maxima`, `valor`) VALUES
-- Unimed Basico
(1, 0, 18, 280.00),
(1, 19, 23, 320.00),
(1, 24, 28, 350.00),
(1, 29, 33, 380.00),
(1, 34, 38, 420.00),
(1, 39, 43, 480.00),
(1, 44, 48, 560.00),
(1, 49, 53, 680.00),
(1, 54, 58, 850.00),
(1, 59, 999, 1200.00),
-- Unimed Intermediario
(2, 0, 18, 440.00),
(2, 19, 23, 500.00),
(2, 24, 28, 550.00),
(2, 29, 33, 600.00),
(2, 34, 38, 680.00),
(2, 39, 43, 780.00),
(2, 44, 48, 920.00),
(2, 49, 53, 1100.00),
(2, 54, 58, 1400.00),
(2, 59, 999, 1900.00),
-- Unimed Plus
(3, 0, 18, 680.00),
(3, 19, 23, 780.00),
(3, 24, 28, 850.00),
(3, 29, 33, 950.00),
(3, 34, 38, 1080.00),
(3, 39, 43, 1250.00),
(3, 44, 48, 1480.00),
(3, 49, 53, 1780.00),
(3, 54, 58, 2200.00),
(3, 59, 999, 3000.00);

-- =============================================================================
-- 14. DADOS DE EXEMPLO - BENEFICIARIOS
-- =============================================================================

INSERT INTO `beneficiarios` (`pessoa_id`, `titular_id`, `estipulante_id`, `plano_id`, `numero_carteirinha`, `codigo_beneficiario`, `tipo`, `parentesco`, `data_adesao`, `data_vigencia_inicio`, `valor_mensalidade`, `dia_vencimento`, `status`) VALUES
(9, NULL, 1, 2, '0001000001', 'BEN001', 'titular', 'titular', '2023-02-01', '2023-03-01', 600.00, 10, 'ativo'),
(10, NULL, 1, 3, '0001000002', 'BEN002', 'titular', 'titular', '2023-04-15', '2023-05-01', 950.00, 10, 'ativo'),
(11, NULL, 2, 2, '0002000001', 'BEN003', 'titular', 'titular', '2023-07-01', '2023-08-01', 550.00, 15, 'ativo'),
(12, NULL, 2, 1, '0002000002', 'BEN004', 'titular', 'titular', '2023-09-10', '2023-10-01', 350.00, 15, 'ativo');

-- =============================================================================
-- 15. DADOS DE EXEMPLO - CARTEIRINHAS
-- =============================================================================

INSERT INTO `carteirinhas` (`beneficiario_id`, `numero_carteirinha`, `via`, `data_emissao`, `data_validade`, `motivo_emissao`, `status`) VALUES
(1, '0001000001', 1, '2023-02-15', '2025-02-15', 'primeira_via', 'ativa'),
(2, '0001000002', 1, '2023-04-20', '2025-04-20', 'primeira_via', 'ativa'),
(3, '0002000001', 1, '2023-07-10', '2025-07-10', 'primeira_via', 'ativa'),
(4, '0002000002', 1, '2023-09-15', '2025-09-15', 'primeira_via', 'ativa');

-- =============================================================================
-- 16. DADOS DE EXEMPLO - PROPOSTAS
-- =============================================================================

INSERT INTO `propostas` (`numero_proposta`, `operadora_id`, `corretor_id`, `nome_proponente`, `cpf_cnpj_proponente`, `email_proponente`, `telefone_proponente`, `nome_empresa`, `numero_funcionarios`, `tipo_plano`, `plano_id`, `valor_proposto`, `status`, `data_proposta`) VALUES
('PROP-2024-001', 1, 1, 'Empresa Nova Ltda', '11.222.333/0001-55', 'contato@empresanova.com', '(11) 99888-7766', 'Empresa Nova', '11-50', 'coletivo_empresarial', 2, 8500.00, 'em_analise', '2024-01-10'),
('PROP-2024-002', 2, 2, 'Comercio Beta S.A.', '22.333.444/0001-66', 'rh@comerciobeta.com', '(11) 99777-6655', 'Comercio Beta', '51-100', 'coletivo_empresarial', 4, 45000.00, 'aprovada', '2024-01-15'),
('PROP-2024-003', 1, 1, 'Servicos Gama Ltda', '33.444.555/0001-77', 'contato@servicosgama.com', '(11) 99666-5544', 'Servicos Gama', '1-10', 'coletivo_empresarial', 1, 2800.00, 'pendente', '2024-01-20');

-- =============================================================================
-- 17. DADOS DE EXEMPLO - CONTRATOS
-- =============================================================================

INSERT INTO `contratos` (`proposta_id`, `operadora_id`, `estipulante_id`, `numero_contrato`, `tipo_contrato`, `data_inicio`, `dia_vencimento`, `valor_total`, `forma_pagamento`, `status`) VALUES
(NULL, 1, 1, 'CONT-2023-001', 'empresarial', '2023-02-01', 10, 5500.00, 'boleto', 'ativo'),
(NULL, 1, 2, 'CONT-2023-002', 'empresarial', '2023-07-01', 15, 3200.00, 'boleto', 'ativo'),
(2, 2, NULL, 'CONT-2024-001', 'empresarial', '2024-02-01', 10, 45000.00, 'boleto', 'ativo');

-- =============================================================================
-- 18. DADOS DE EXEMPLO - FATURAS
-- =============================================================================

INSERT INTO `faturas` (`contrato_id`, `beneficiario_id`, `estipulante_id`, `numero_fatura`, `competencia`, `data_vencimento`, `valor_original`, `status`) VALUES
(1, NULL, 1, 'FAT-2024-001', '2024-01-01', '2024-01-10', 5500.00, 'paga'),
(1, NULL, 1, 'FAT-2024-002', '2024-02-01', '2024-02-10', 5500.00, 'paga'),
(1, NULL, 1, 'FAT-2024-003', '2024-03-01', '2024-03-10', 5500.00, 'aberta'),
(2, NULL, 2, 'FAT-2024-004', '2024-01-01', '2024-01-15', 3200.00, 'paga'),
(2, NULL, 2, 'FAT-2024-005', '2024-02-01', '2024-02-15', 3200.00, 'vencida'),
(2, NULL, 2, 'FAT-2024-006', '2024-03-01', '2024-03-15', 3200.00, 'aberta');

-- =============================================================================
-- 19. DADOS DE EXEMPLO - BOLETOS
-- =============================================================================

INSERT INTO `boletos` (`fatura_id`, `nosso_numero`, `linha_digitavel`, `banco`, `data_emissao`, `data_vencimento`, `valor`, `status`) VALUES
(1, '00100001', '00190.00009 01234.567009 00001.234567 1 12340000550000', '001', '2024-01-05', '2024-01-10', 5500.00, 'pago'),
(2, '00100002', '00190.00009 01234.567009 00001.234568 1 12340000550000', '001', '2024-02-05', '2024-02-10', 5500.00, 'pago'),
(3, '00100003', '00190.00009 01234.567009 00001.234569 1 12340000550000', '001', '2024-03-05', '2024-03-10', 5500.00, 'gerado'),
(4, '00100004', '00190.00009 01234.567009 00001.234570 1 12340000320000', '001', '2024-01-10', '2024-01-15', 3200.00, 'pago'),
(5, '00100005', '00190.00009 01234.567009 00001.234571 1 12340000320000', '001', '2024-02-10', '2024-02-15', 3200.00, 'vencido'),
(6, '00100006', '00190.00009 01234.567009 00001.234572 1 12340000320000', '001', '2024-03-10', '2024-03-15', 3200.00, 'gerado');

-- =============================================================================
-- 20. DADOS DE EXEMPLO - PAGAMENTOS
-- =============================================================================

INSERT INTO `pagamentos` (`fatura_id`, `boleto_id`, `data_pagamento`, `valor_pago`, `forma_pagamento`, `banco_recebedor`) VALUES
(1, 1, '2024-01-10', 5500.00, 'boleto', 'Banco do Brasil'),
(2, 2, '2024-02-08', 5500.00, 'boleto', 'Banco do Brasil'),
(4, 4, '2024-01-15', 3200.00, 'boleto', 'Banco do Brasil');

-- =============================================================================
-- 21. DADOS DE EXEMPLO - NOTIFICACOES
-- =============================================================================

INSERT INTO `notificacoes` (`usuario_id`, `titulo`, `mensagem`, `tipo`, `link`, `lida`) VALUES
(1, 'Bem-vindo ao sistema!', 'Voce esta usando o Card Brazil, sistema de gestao de planos de saude. Explore as funcionalidades disponiveis.', 'info', '/dashboard', 0),
(1, 'Faturas vencidas', 'Existem 1 fatura(s) vencida(s) aguardando pagamento. Verifique o modulo de cobranca.', 'alerta', '/dashboard/cobranca/inadimplencia', 0),
(1, 'Nova proposta recebida', 'Uma nova proposta foi cadastrada e aguarda analise.', 'info', '/dashboard/propostas/pendentes', 0);

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- FIM DOS INSERTS INICIAIS
-- =============================================================================
