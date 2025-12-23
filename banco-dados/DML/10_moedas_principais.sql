-- =============================================
-- Script: 10_moedas_principais.sql
-- Descrição: Cadastro inicial das principais moedas internacionais
-- Database: cardbrazil
-- =============================================

-- Inserir moedas principais (usando id_administradora = 1)
INSERT INTO moedas (id_administradora, codigo, nome, simbolo, pais, status) VALUES
(1, 'USD', 'Dólar Americano', '$', 'Estados Unidos', 'Ativa'),
(1, 'EUR', 'Euro', '€', 'União Europeia', 'Ativa'),
(1, 'GBP', 'Libra Esterlina', '£', 'Reino Unido', 'Ativa'),
(1, 'JPY', 'Iene Japonês', '¥', 'Japão', 'Ativa'),
(1, 'CHF', 'Franco Suíço', 'CHF', 'Suíça', 'Ativa'),
(1, 'CAD', 'Dólar Canadense', 'C$', 'Canadá', 'Ativa'),
(1, 'AUD', 'Dólar Australiano', 'A$', 'Austrália', 'Ativa'),
(1, 'CNY', 'Yuan Chinês', '¥', 'China', 'Ativa'),
(1, 'ARS', 'Peso Argentino', '$', 'Argentina', 'Ativa'),
(1, 'CLP', 'Peso Chileno', '$', 'Chile', 'Ativa'),
(1, 'UYU', 'Peso Uruguaio', '$U', 'Uruguai', 'Ativa'),
(1, 'PYG', 'Guarani Paraguaio', '₲', 'Paraguai', 'Ativa'),
(1, 'MXN', 'Peso Mexicano', '$', 'México', 'Ativa'),
(1, 'COP', 'Peso Colombiano', '$', 'Colômbia', 'Ativa'),
(1, 'PEN', 'Sol Peruano', 'S/', 'Peru', 'Ativa'),
(1, 'BOB', 'Boliviano', 'Bs', 'Bolívia', 'Ativa'),
(1, 'VEF', 'Bolívar Venezuelano', 'Bs', 'Venezuela', 'Ativa'),
(1, 'KRW', 'Won Sul-Coreano', '₩', 'Coreia do Sul', 'Ativa'),
(1, 'INR', 'Rúpia Indiana', '₹', 'Índia', 'Ativa'),
(1, 'RUB', 'Rublo Russo', '₽', 'Rússia', 'Ativa'),
(1, 'ZAR', 'Rand Sul-Africano', 'R', 'África do Sul', 'Ativa'),
(1, 'TRY', 'Lira Turca', '₺', 'Turquia', 'Ativa'),
(1, 'NZD', 'Dólar Neozelandês', 'NZ$', 'Nova Zelândia', 'Ativa'),
(1, 'SEK', 'Coroa Sueca', 'kr', 'Suécia', 'Ativa'),
(1, 'NOK', 'Coroa Norueguesa', 'kr', 'Noruega', 'Ativa');
