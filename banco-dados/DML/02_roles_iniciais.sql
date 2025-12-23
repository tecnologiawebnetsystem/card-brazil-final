-- =============================================
-- Script: 02_roles_iniciais.sql
-- Descrição: Criação de roles (perfis) iniciais
-- Database: cardbrazil
-- =============================================

USE cardbrazil;

-- Adicionando perfis de Cadastro e Propostas
INSERT INTO roles (id_administradora, nome, descricao, ativo) VALUES
(1, 'Admin', 'Administrador com acesso total ao sistema', TRUE),
(1, 'Cadastro', 'Usuário com acesso apenas aos cadastros', TRUE),
(1, 'Propostas', 'Usuário com acesso apenas ao módulo de propostas', TRUE),
(1, 'Financeiro', 'Usuário com acesso ao módulo financeiro', TRUE),
(1, 'Consulta', 'Usuário com acesso apenas para consulta', TRUE);
