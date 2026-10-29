-- =============================================
-- Script: 09_bancos_brasileiros.sql
-- Descrição: Cadastro inicial dos principais bancos brasileiros
-- Database: cardbrazil
-- =============================================

-- Inserir bancos principais (usando id_administradora = 1)
INSERT INTO bancos (id_administradora, codigo, nome, nome_curto, tipo, cnpj, status) VALUES
(1, '001', 'Banco do Brasil S.A.', 'BB', 'Público', '00.000.000/0001-91', 'Ativo'),
(1, '003', 'Banco da Amazônia S.A.', 'BASA', 'Público', '04.902.979/0001-44', 'Ativo'),
(1, '004', 'Banco do Nordeste do Brasil S.A.', 'BNB', 'Público', '07.237.373/0001-20', 'Ativo'),
(1, '021', 'Banestes S.A. Banco do Estado do Espírito Santo', 'BANESTES', 'Público', '28.127.603/0001-78', 'Ativo'),
(1, '033', 'Banco Santander (Brasil) S.A.', 'Santander', 'Privado', '90.400.888/0001-42', 'Ativo'),
(1, '036', 'Banco Bradesco BBI S.A.', 'Bradesco BBI', 'Privado', '06.271.464/0001-19', 'Ativo'),
(1, '037', 'Banco do Estado do Pará S.A.', 'Banpará', 'Público', '04.913.711/0001-08', 'Ativo'),
(1, '041', 'Banco do Estado do Rio Grande do Sul S.A.', 'Banrisul', 'Público', '92.702.067/0001-96', 'Ativo'),
(1, '047', 'Banco do Estado de Sergipe S.A.', 'Banese', 'Público', '13.009.717/0001-02', 'Ativo'),
(1, '070', 'BRB - Banco de Brasília S.A.', 'BRB', 'Público', '00.000.208/0001-00', 'Ativo'),
(1, '077', 'Banco Inter S.A.', 'Inter', 'Privado', '00.416.968/0001-01', 'Ativo'),
(1, '104', 'Caixa Econômica Federal', 'CEF', 'Público', '00.360.305/0001-04', 'Ativo'),
(1, '212', 'Banco Original S.A.', 'Original', 'Privado', '92.894.922/0001-08', 'Ativo'),
(1, '237', 'Banco Bradesco S.A.', 'Bradesco', 'Privado', '60.746.948/0001-12', 'Ativo'),
(1, '260', 'Nu Pagamentos S.A. (Nubank)', 'Nubank', 'Privado', '18.236.120/0001-58', 'Ativo'),
(1, '290', 'PagSeguro Internet S.A.', 'PagBank', 'Privado', '08.561.701/0001-01', 'Ativo'),
(1, '318', 'Banco BMG S.A.', 'BMG', 'Privado', '61.186.680/0001-74', 'Ativo'),
(1, '323', 'Mercado Pago', 'Mercado Pago', 'Privado', '10.573.521/0001-91', 'Ativo'),
(1, '341', 'Itaú Unibanco S.A.', 'Itaú', 'Privado', '60.701.190/0001-04', 'Ativo'),
(1, '389', 'Banco Mercantil do Brasil S.A.', 'Mercantil', 'Privado', '17.184.037/0001-10', 'Ativo'),
(1, '422', 'Banco Safra S.A.', 'Safra', 'Privado', '58.160.789/0001-28', 'Ativo'),
(1, '623', 'Banco Pan S.A.', 'Pan', 'Privado', '59.285.411/0001-13', 'Ativo'),
(1, '633', 'Banco Rendimento S.A.', 'Rendimento', 'Privado', '68.900.810/0001-38', 'Ativo'),
(1, '637', 'Banco Sofisa S.A.', 'Sofisa', 'Privado', '60.889.128/0001-80', 'Ativo'),
(1, '643', 'Banco Pine S.A.', 'Pine', 'Privado', '62.144.175/0001-20', 'Ativo'),
(1, '653', 'Banco Indusval S.A.', 'Indusval', 'Privado', '61.024.352/0001-71', 'Ativo'),
(1, '707', 'Banco Daycoval S.A.', 'Daycoval', 'Privado', '62.232.889/0001-90', 'Ativo'),
(1, '739', 'Banco Cetelem S.A.', 'Cetelem', 'Privado', '00.558.456/0001-71', 'Ativo'),
(1, '741', 'Banco Ribeirão Preto S.A.', 'BRP', 'Privado', '00.517.645/0001-04', 'Ativo'),
(1, '745', 'Banco Citibank S.A.', 'Citibank', 'Privado', '33.479.023/0001-80', 'Ativo'),
(1, '748', 'Banco Cooperativo Sicredi S.A.', 'Sicredi', 'Cooperativa', '01.181.521/0001-55', 'Ativo'),
(1, '756', 'Banco Cooperativo do Brasil S.A. - Bancoob', 'Bancoob', 'Cooperativa', '02.038.232/0001-64', 'Ativo');
