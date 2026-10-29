-- =============================================
-- Script: 06_estipulantes_teste.sql
-- Descrição: Cadastro de 20 estipulantes (somente PJ)
-- Database: cardbrazil
-- =============================================

USE cardbrazil;

-- Criando 20 estipulantes vinculados a pessoas jurídicas
INSERT INTO estipulantes (id_administradora, nome, cnpj, codigo, telefone, email, data_cadastro, status) VALUES
(1, 'Tech Solutions Tecnologia Ltda', '12345678000190', 'EST001', '1133334444', 'contato@techsolutions.com.br', CURDATE(), 'ativo'),
(1, 'Comercial Alvorada Distribuidora Ltda', '23456789000191', 'EST002', '1133335555', 'contato@alvorada.com.br', CURDATE(), 'ativo'),
(1, 'Indústria Moderna Sociedade Anônima', '34567890000192', 'EST003', '1133336666', 'contato@moderna.com.br', CURDATE(), 'ativo'),
(1, 'Serviços Integrados Empresariais Ltda', '45678901000193', 'EST004', '1133337777', 'contato@integrados.com.br', CURDATE(), 'ativo'),
(1, 'Construtora Horizonte Engenharia Ltda', '56789012000194', 'EST005', '1133338888', 'contato@horizonte.com.br', CURDATE(), 'ativo'),
(1, 'Transportadora Rápida Logística Ltda', '67890123000195', 'EST006', '1133339999', 'contato@rapida.com.br', CURDATE(), 'ativo'),
(1, 'Consultoria Empresarial Estratégica Ltda', '78901234000196', 'EST007', '1133330000', 'contato@consultoria.com.br', CURDATE(), 'ativo'),
(1, 'Farmácia Saúde Total Medicamentos Ltda', '89012345000197', 'EST008', '1133331111', 'contato@saudetotal.com.br', CURDATE(), 'ativo'),
(1, 'Supermercado Bom Preço Alimentos Ltda', '90123456000198', 'EST009', '1133332222', 'contato@bompreco.com.br', CURDATE(), 'ativo'),
(1, 'Escola Futuro Brilhante Educação Ltda', '01234567000199', 'EST010', '1133333333', 'contato@futurobrilhante.com.br', CURDATE(), 'ativo'),
(1, 'Clínica Médica Vida Saúde Ltda', '11234567000100', 'EST011', '1133334455', 'contato@vida.com.br', CURDATE(), 'ativo'),
(1, 'Restaurante Sabor & Arte Gastronomia Ltda', '22345678000101', 'EST012', '1133335566', 'contato@saborarte.com.br', CURDATE(), 'ativo'),
(1, 'Hotel Estrela do Sul Hospedagem Ltda', '33456789000102', 'EST013', '1133336677', 'contato@estreladosul.com.br', CURDATE(), 'ativo'),
(1, 'Academia Corpo Saudável Fitness Ltda', '44567890000103', 'EST014', '1133337788', 'contato@corposaudavel.com.br', CURDATE(), 'ativo'),
(1, 'Imobiliária Prime Negócios Ltda', '55678901000104', 'EST015', '1133338899', 'contato@prime.com.br', CURDATE(), 'ativo'),
(1, 'Advocacia Silva & Associados Ltda', '66789012000105', 'EST016', '1133339900', 'contato@silvaadvogados.com.br', CURDATE(), 'ativo'),
(1, 'Contabilidade Exata Serviços Ltda', '77890123000106', 'EST017', '1133330011', 'contato@exata.com.br', CURDATE(), 'ativo'),
(1, 'Gráfica Impressão Perfeita Ltda', '88901234000107', 'EST018', '1133331122', 'contato@impressaoperfeita.com.br', CURDATE(), 'ativo'),
(1, 'Oficina Mecânica Turbo Auto Center Ltda', '99012345000108', 'EST019', '1133332233', 'contato@turbo.com.br', CURDATE(), 'ativo'),
(1, 'Lavanderia Clean Express Serviços Ltda', '00123456000109', 'EST020', '1133333344', 'contato@cleanexpress.com.br', CURDATE(), 'ativo');
