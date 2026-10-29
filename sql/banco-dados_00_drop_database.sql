-- =====================================================
-- SCRIPT: DROP DATABASE
-- Banco: MySQL 8.0+
-- Descrição: Remove completamente o banco de dados
-- ATENÇÃO: Este script apaga TODOS os dados!
-- =====================================================

-- Alterando nome do database de cardbrazil_crm para cardbrazil
DROP DATABASE IF EXISTS cardbrazil;

-- Recria o banco de dados vazio
CREATE DATABASE cardbrazil
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Seleciona o banco de dados
USE cardbrazil;

-- Mensagem de confirmação
SELECT 'Banco de dados cardbrazil recriado com sucesso!' AS status;
