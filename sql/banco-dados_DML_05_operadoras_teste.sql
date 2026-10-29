-- =============================================
-- Script: 05_operadoras_teste.sql
-- Descrição: Cadastro de 15 operadoras para testes
-- Database: cardbrazil
-- =============================================

USE cardbrazil;

-- Criando 15 operadoras
INSERT INTO operadoras (id_administradora, nome, cnpj, registro_ans, telefone, email, status) VALUES
(1, 'Unimed Nacional', '12345678000190', '123456', '1133334444', 'contato@unimed.com.br', 'ativo'),
(1, 'Bradesco Saúde', '23456789000191', '234567', '1133335555', 'contato@bradescosaude.com.br', 'ativo'),
(1, 'Amil Assistência Médica', '34567890000192', '345678', '1133336666', 'contato@amil.com.br', 'ativo'),
(1, 'SulAmérica Saúde', '45678901000193', '456789', '1133337777', 'contato@sulamerica.com.br', 'ativo'),
(1, 'NotreDame Intermédica', '56789012000194', '567890', '1133338888', 'contato@gndi.com.br', 'ativo'),
(1, 'Hapvida Assistência Médica', '67890123000195', '678901', '1133339999', 'contato@hapvida.com.br', 'ativo'),
(1, 'Porto Seguro Saúde', '78901234000196', '789012', '1133330000', 'contato@portoseguro.com.br', 'ativo'),
(1, 'Prevent Senior', '89012345000197', '890123', '1133331111', 'contato@preventsenior.com.br', 'ativo'),
(1, 'São Francisco Saúde', '90123456000198', '901234', '1133332222', 'contato@saofrancisco.com.br', 'ativo'),
(1, 'Golden Cross', '01234567000199', '012345', '1133333333', 'contato@goldencross.com.br', 'ativo'),
(1, 'Cassi - Caixa Econômica', '11234567000100', '112345', '1133334455', 'contato@cassi.com.br', 'ativo'),
(1, 'Geap Autogestão em Saúde', '22345678000101', '223456', '1133335566', 'contato@geap.com.br', 'ativo'),
(1, 'Care Plus Medicina Assistencial', '33456789000102', '334567', '1133336677', 'contato@careplus.com.br', 'ativo'),
(1, 'Omint Serviços de Saúde', '44567890000103', '445678', '1133337788', 'contato@omint.com.br', 'ativo'),
(1, 'Mediservice Operadora de Planos', '55678901000104', '556789', '1133338899', 'contato@mediservice.com.br', 'ativo');
