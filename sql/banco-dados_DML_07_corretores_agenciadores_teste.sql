-- =============================================
-- Script: 07_corretores_agenciadores_teste.sql
-- Descrição: Cadastro de 30 corretores e 30 agenciadores
-- Database: cardbrazil
-- =============================================

USE cardbrazil;

-- Criando 30 corretores (10 PF + 10 PJ)
-- Corretores Pessoa Física (10)
INSERT INTO corretores (id_administradora, nome, cpf, registro_susep, telefone, email, data_cadastro, status) VALUES
(1, 'João Silva Santos', '12345678901', 'SUSEP001', '11987654321', 'joao.silva@email.com', CURDATE(), 'ativo'),
(1, 'Maria Oliveira Costa', '23456789012', 'SUSEP002', '11987654322', 'maria.oliveira@email.com', CURDATE(), 'ativo'),
(1, 'Pedro Henrique Souza', '34567890123', 'SUSEP003', '11987654323', 'pedro.souza@email.com', CURDATE(), 'ativo'),
(1, 'Ana Paula Ferreira', '45678901234', 'SUSEP004', '11987654324', 'ana.ferreira@email.com', CURDATE(), 'ativo'),
(1, 'Carlos Eduardo Lima', '56789012345', 'SUSEP005', '11987654325', 'carlos.lima@email.com', CURDATE(), 'ativo'),
(1, 'Juliana Martins Rocha', '67890123456', 'SUSEP006', '11987654326', 'juliana.rocha@email.com', CURDATE(), 'ativo'),
(1, 'Ricardo Alves Pereira', '78901234567', 'SUSEP007', '11987654327', 'ricardo.pereira@email.com', CURDATE(), 'ativo'),
(1, 'Fernanda Costa Ribeiro', '89012345678', 'SUSEP008', '11987654328', 'fernanda.ribeiro@email.com', CURDATE(), 'ativo'),
(1, 'Marcos Vinícius Dias', '90123456789', 'SUSEP009', '11987654329', 'marcos.dias@email.com', CURDATE(), 'ativo'),
(1, 'Patrícia Gomes Silva', '01234567890', 'SUSEP010', '11987654330', 'patricia.gomes@email.com', CURDATE(), 'ativo');

-- Corretores Pessoa Jurídica (10)
INSERT INTO corretores (id_administradora, razao_social, cnpj, registro_susep, telefone, email, data_cadastro, status) VALUES
(1, 'Corretora Seguros Total Ltda', '10234567000110', 'SUSEP011', '11987651021', 'contato@segurostotal.com.br', CURDATE(), 'ativo'),
(1, 'Corretora Vida Segura Ltda', '20345678000111', 'SUSEP012', '11987651022', 'contato@vidasegura.com.br', CURDATE(), 'ativo'),
(1, 'Corretora Proteção Familiar Ltda', '30456789000112', 'SUSEP013', '11987651023', 'contato@protecaofamiliar.com.br', CURDATE(), 'ativo'),
(1, 'Corretora Saúde Plena Ltda', '40567890000113', 'SUSEP014', '11987651024', 'contato@saudeplena.com.br', CURDATE(), 'ativo'),
(1, 'Corretora Bem Estar Ltda', '50678901000114', 'SUSEP015', '11987651025', 'contato@bemestar.com.br', CURDATE(), 'ativo'),
(1, 'Corretora Futuro Seguro Ltda', '60789012000115', 'SUSEP016', '11987651026', 'contato@futuroseguro.com.br', CURDATE(), 'ativo'),
(1, 'Corretora Confiança Total Ltda', '70890123000116', 'SUSEP017', '11987651027', 'contato@confiancatotal.com.br', CURDATE(), 'ativo'),
(1, 'Corretora Tranquilidade Ltda', '80901234000117', 'SUSEP018', '11987651028', 'contato@tranquilidade.com.br', CURDATE(), 'ativo'),
(1, 'Corretora Seguridade Ltda', '90012345000118', 'SUSEP019', '11987651029', 'contato@seguridade.com.br', CURDATE(), 'ativo'),
(1, 'Corretora Amparo Total Ltda', '00234567000119', 'SUSEP020', '11987651030', 'contato@amparototal.com.br', CURDATE(), 'ativo');

-- Criando 30 agenciadores (10 PF + 10 PJ)
-- Agenciadores Pessoa Física (10)
INSERT INTO agenciadores (id_administradora, nome, cpf, codigo, telefone, email, data_cadastro, status) VALUES
(1, 'Roberto Carlos Mendes', '11234567890', 'AGENC001', '11987654331', 'roberto.mendes@email.com', CURDATE(), 'ativo'),
(1, 'Camila Rodrigues Almeida', '22345678901', 'AGENC002', '11987654332', 'camila.almeida@email.com', CURDATE(), 'ativo'),
(1, 'Felipe Augusto Barbosa', '33456789012', 'AGENC003', '11987654333', 'felipe.barbosa@email.com', CURDATE(), 'ativo'),
(1, 'Larissa Beatriz Santos', '44567890123', 'AGENC004', '11987654334', 'larissa.santos@email.com', CURDATE(), 'ativo'),
(1, 'Thiago Henrique Cardoso', '55678901234', 'AGENC005', '11987654335', 'thiago.cardoso@email.com', CURDATE(), 'ativo'),
(1, 'Gabriela Fernandes Lima', '66789012345', 'AGENC006', '11987654336', 'gabriela.lima@email.com', CURDATE(), 'ativo'),
(1, 'Bruno Henrique Costa', '77890123456', 'AGENC007', '11987654337', 'bruno.costa@email.com', CURDATE(), 'ativo'),
(1, 'Amanda Silva Rocha', '88901234567', 'AGENC008', '11987654338', 'amanda.rocha@email.com', CURDATE(), 'ativo'),
(1, 'Rafael Augusto Dias', '99012345678', 'AGENC009', '11987654339', 'rafael.dias@email.com', CURDATE(), 'ativo'),
(1, 'Beatriz Oliveira Santos', '00123456789', 'AGENC010', '11987654340', 'beatriz.santos@email.com', CURDATE(), 'ativo');

-- Agenciadores Pessoa Jurídica (10)
INSERT INTO agenciadores (id_administradora, razao_social, cnpj, codigo, telefone, email, data_cadastro, status) VALUES
(1, 'Agenciadora Saúde & Vida Ltda', '10345678000120', 'AGENC011', '11987651031', 'contato@saudevida.com.br', CURDATE(), 'ativo'),
(1, 'Agenciadora Bem Viver Ltda', '20456789000121', 'AGENC012', '11987651032', 'contato@bemviver.com.br', CURDATE(), 'ativo'),
(1, 'Agenciadora Qualidade de Vida Ltda', '30567890000122', 'AGENC013', '11987651033', 'contato@qualidadevida.com.br', CURDATE(), 'ativo'),
(1, 'Agenciadora Cuidar Bem Ltda', '40678901000123', 'AGENC014', '11987651034', 'contato@cuidarbem.com.br', CURDATE(), 'ativo'),
(1, 'Agenciadora Viver Melhor Ltda', '50789012000124', 'AGENC015', '11987651035', 'contato@vivermelhor.com.br', CURDATE(), 'ativo'),
(1, 'Agenciadora Saúde Total Ltda', '60890123000125', 'AGENC016', '11987651036', 'contato@saudetotal.com.br', CURDATE(), 'ativo'),
(1, 'Agenciadora Proteção Familiar Ltda', '70901234000126', 'AGENC017', '11987651037', 'contato@protecaofam.com.br', CURDATE(), 'ativo'),
(1, 'Agenciadora Vida Plena Ltda', '80012345000127', 'AGENC018', '11987651038', 'contato@vidaplena.com.br', CURDATE(), 'ativo'),
(1, 'Agenciadora Bem Estar Total Ltda', '90123456000128', 'AGENC019', '11987651039', 'contato@bemestartotal.com.br', CURDATE(), 'ativo'),
(1, 'Agenciadora Saúde Sempre Ltda', '00345678000129', 'AGENC020', '11987651040', 'contato@saudesempre.com.br', CURDATE(), 'ativo');
