-- =============================================
-- Script: 11_feriados_nacionais.sql
-- Descrição: Cadastro dos feriados nacionais brasileiros
-- Database: cardbrazil
-- =============================================

-- Feriados Nacionais Fixos 2024 (usando id_administradora = 1)
INSERT INTO feriados (id_administradora, data, nome, tipo, fixo, descricao) VALUES
(1, '2024-01-01', 'Confraternização Universal', 'Nacional', TRUE, 'Ano Novo'),
(1, '2024-04-21', 'Tiradentes', 'Nacional', TRUE, 'Dia de Tiradentes'),
(1, '2024-05-01', 'Dia do Trabalhador', 'Nacional', TRUE, 'Dia Mundial do Trabalho'),
(1, '2024-09-07', 'Independência do Brasil', 'Nacional', TRUE, 'Proclamação da Independência'),
(1, '2024-10-12', 'Nossa Senhora Aparecida', 'Nacional', TRUE, 'Padroeira do Brasil'),
(1, '2024-11-02', 'Finados', 'Nacional', TRUE, 'Dia de Finados'),
(1, '2024-11-15', 'Proclamação da República', 'Nacional', TRUE, 'Dia da República'),
(1, '2024-11-20', 'Dia da Consciência Negra', 'Nacional', TRUE, 'Consciência Negra'),
(1, '2024-12-25', 'Natal', 'Nacional', TRUE, 'Nascimento de Jesus Cristo');

-- Feriados Nacionais Móveis 2024
INSERT INTO feriados (id_administradora, data, nome, tipo, fixo, descricao) VALUES
(1, '2024-02-12', 'Carnaval', 'Nacional', FALSE, 'Segunda-feira de Carnaval'),
(1, '2024-02-13', 'Carnaval', 'Nacional', FALSE, 'Terça-feira de Carnaval'),
(1, '2024-02-14', 'Quarta-feira de Cinzas', 'Nacional', FALSE, 'Ponto Facultativo até 14h'),
(1, '2024-03-29', 'Sexta-feira Santa', 'Nacional', FALSE, 'Paixão de Cristo'),
(1, '2024-03-31', 'Páscoa', 'Nacional', FALSE, 'Domingo de Páscoa'),
(1, '2024-05-30', 'Corpus Christi', 'Nacional', FALSE, 'Corpo de Cristo');

-- Feriados Nacionais Fixos 2025
INSERT INTO feriados (id_administradora, data, nome, tipo, fixo, descricao) VALUES
(1, '2025-01-01', 'Confraternização Universal', 'Nacional', TRUE, 'Ano Novo'),
(1, '2025-04-21', 'Tiradentes', 'Nacional', TRUE, 'Dia de Tiradentes'),
(1, '2025-05-01', 'Dia do Trabalhador', 'Nacional', TRUE, 'Dia Mundial do Trabalho'),
(1, '2025-09-07', 'Independência do Brasil', 'Nacional', TRUE, 'Proclamação da Independência'),
(1, '2025-10-12', 'Nossa Senhora Aparecida', 'Nacional', TRUE, 'Padroeira do Brasil'),
(1, '2025-11-02', 'Finados', 'Nacional', TRUE, 'Dia de Finados'),
(1, '2025-11-15', 'Proclamação da República', 'Nacional', TRUE, 'Dia da República'),
(1, '2025-11-20', 'Dia da Consciência Negra', 'Nacional', TRUE, 'Consciência Negra'),
(1, '2025-12-25', 'Natal', 'Nacional', TRUE, 'Nascimento de Jesus Cristo');

-- Feriados Nacionais Móveis 2025
INSERT INTO feriados (id_administradora, data, nome, tipo, fixo, descricao) VALUES
(1, '2025-03-03', 'Carnaval', 'Nacional', FALSE, 'Segunda-feira de Carnaval'),
(1, '2025-03-04', 'Carnaval', 'Nacional', FALSE, 'Terça-feira de Carnaval'),
(1, '2025-03-05', 'Quarta-feira de Cinzas', 'Nacional', FALSE, 'Ponto Facultativo até 14h'),
(1, '2025-04-18', 'Sexta-feira Santa', 'Nacional', FALSE, 'Paixão de Cristo'),
(1, '2025-04-20', 'Páscoa', 'Nacional', FALSE, 'Domingo de Páscoa'),
(1, '2025-06-19', 'Corpus Christi', 'Nacional', FALSE, 'Corpo de Cristo');
