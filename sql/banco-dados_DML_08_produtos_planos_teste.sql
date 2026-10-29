-- =============================================
-- Script: 08_produtos_planos_teste.sql
-- Descrição: Cadastro de 25 produtos, 30 planos e 45 faixas
-- Database: cardbrazil
-- =============================================

USE cardbrazil;

-- Criando 25 produtos
INSERT INTO produtos (id_administradora, nome, descricao, categoria, status) VALUES
(1, 'Plano Ambulatorial Básico', 'Cobertura ambulatorial com consultas e exames básicos', 'Ambulatorial', 'ativo'),
(1, 'Plano Ambulatorial Completo', 'Cobertura ambulatorial completa com todos os exames', 'Ambulatorial', 'ativo'),
(1, 'Plano Hospitalar com Obstetrícia', 'Internações hospitalares incluindo parto', 'Hospitalar', 'ativo'),
(1, 'Plano Hospitalar sem Obstetrícia', 'Internações hospitalares exceto parto', 'Hospitalar', 'ativo'),
(1, 'Plano Odontológico Básico', 'Procedimentos odontológicos preventivos', 'Odontológico', 'ativo'),
(1, 'Plano Odontológico Completo', 'Todos os procedimentos odontológicos', 'Odontológico', 'ativo'),
(1, 'Plano Referência', 'Cobertura completa conforme rol ANS', 'Referência', 'ativo'),
(1, 'Plano Executivo', 'Plano premium com rede diferenciada', 'Executivo', 'ativo'),
(1, 'Plano Empresarial PME', 'Plano para pequenas e médias empresas', 'Empresarial', 'ativo'),
(1, 'Plano Empresarial Corporativo', 'Plano para grandes empresas', 'Empresarial', 'ativo'),
(1, 'Plano Adesão', 'Plano por adesão para entidades de classe', 'Adesão', 'ativo'),
(1, 'Plano Individual/Familiar', 'Plano para pessoa física e família', 'Individual', 'ativo'),
(1, 'Plano Sênior', 'Plano especial para maiores de 59 anos', 'Sênior', 'ativo'),
(1, 'Plano Jovem', 'Plano especial para até 29 anos', 'Jovem', 'ativo'),
(1, 'Plano Maternidade', 'Cobertura especial para gestantes', 'Maternidade', 'ativo'),
(1, 'Plano Oncológico', 'Cobertura especial para tratamento oncológico', 'Oncológico', 'ativo'),
(1, 'Plano Home Care', 'Atendimento domiciliar', 'Home Care', 'ativo'),
(1, 'Plano Telemedicina', 'Consultas por telemedicina', 'Telemedicina', 'ativo'),
(1, 'Plano Check-up', 'Programa de check-up anual', 'Check-up', 'ativo'),
(1, 'Plano Medicina Preventiva', 'Foco em prevenção e qualidade de vida', 'Preventivo', 'ativo'),
(1, 'Plano Reembolso', 'Plano com reembolso de despesas', 'Reembolso', 'ativo'),
(1, 'Plano Coparticipação', 'Plano com coparticipação em consultas', 'Coparticipação', 'ativo'),
(1, 'Plano Nacional', 'Cobertura em todo território nacional', 'Nacional', 'ativo'),
(1, 'Plano Regional', 'Cobertura regional', 'Regional', 'ativo'),
(1, 'Plano Internacional', 'Cobertura internacional', 'Internacional', 'ativo');

-- Criando 30 planos vinculados aos produtos e operadoras
INSERT INTO planos (id_administradora, operadora_id, produto_id, nome, codigo, tipo, abrangencia, acomodacao, mensalidade, status) VALUES
(1, 1, 1, 'Unimed Ambulatorial Básico', 'UNI-AMB-BAS', 'Ambulatorial', 'Nacional', 'Não se aplica', 150.00, 'ativo'),
(1, 1, 2, 'Unimed Ambulatorial Plus', 'UNI-AMB-PLU', 'Ambulatorial', 'Nacional', 'Não se aplica', 250.00, 'ativo'),
(1, 1, 3, 'Unimed Hospitalar com Obstetrícia', 'UNI-HOS-OBS', 'Hospitalar', 'Nacional', 'Enfermaria', 450.00, 'ativo'),
(1, 2, 4, 'Bradesco Hospitalar sem Obstetrícia', 'BRA-HOS-SEM', 'Hospitalar', 'Nacional', 'Apartamento', 550.00, 'ativo'),
(1, 2, 7, 'Bradesco Referência', 'BRA-REF', 'Referência', 'Nacional', 'Apartamento', 650.00, 'ativo'),
(1, 3, 8, 'Amil Executivo', 'AMI-EXE', 'Executivo', 'Nacional', 'Apartamento', 850.00, 'ativo'),
(1, 3, 9, 'Amil Empresarial PME', 'AMI-EMP-PME', 'Empresarial', 'Nacional', 'Enfermaria', 380.00, 'ativo'),
(1, 4, 10, 'SulAmérica Corporativo', 'SUL-COR', 'Empresarial', 'Nacional', 'Apartamento', 720.00, 'ativo'),
(1, 4, 11, 'SulAmérica Adesão', 'SUL-ADE', 'Adesão', 'Nacional', 'Enfermaria', 420.00, 'ativo'),
(1, 5, 12, 'NotreDame Individual', 'NOT-IND', 'Individual', 'Regional', 'Enfermaria', 480.00, 'ativo'),
(1, 5, 13, 'NotreDame Sênior', 'NOT-SEN', 'Sênior', 'Regional', 'Apartamento', 680.00, 'ativo'),
(1, 6, 14, 'Hapvida Jovem', 'HAP-JOV', 'Jovem', 'Regional', 'Enfermaria', 280.00, 'ativo'),
(1, 6, 15, 'Hapvida Maternidade', 'HAP-MAT', 'Maternidade', 'Regional', 'Apartamento', 580.00, 'ativo'),
(1, 7, 16, 'Porto Seguro Oncológico', 'POR-ONC', 'Oncológico', 'Nacional', 'Apartamento', 950.00, 'ativo'),
(1, 7, 17, 'Porto Seguro Home Care', 'POR-HOM', 'Home Care', 'Nacional', 'Não se aplica', 1200.00, 'ativo'),
(1, 8, 18, 'Prevent Senior Telemedicina', 'PRE-TEL', 'Telemedicina', 'Nacional', 'Não se aplica', 120.00, 'ativo'),
(1, 8, 19, 'Prevent Senior Check-up', 'PRE-CHE', 'Check-up', 'Regional', 'Não se aplica', 180.00, 'ativo'),
(1, 9, 20, 'São Francisco Preventivo', 'SAO-PRE', 'Preventivo', 'Regional', 'Enfermaria', 320.00, 'ativo'),
(1, 9, 21, 'São Francisco Reembolso', 'SAO-REE', 'Reembolso', 'Nacional', 'Apartamento', 780.00, 'ativo'),
(1, 10, 22, 'Golden Cross Coparticipação', 'GOL-COP', 'Coparticipação', 'Nacional', 'Apartamento', 520.00, 'ativo'),
(1, 10, 23, 'Golden Cross Nacional', 'GOL-NAC', 'Nacional', 'Nacional', 'Apartamento', 820.00, 'ativo'),
(1, 11, 24, 'Cassi Regional', 'CAS-REG', 'Regional', 'Regional', 'Enfermaria', 380.00, 'ativo'),
(1, 11, 1, 'Cassi Ambulatorial', 'CAS-AMB', 'Ambulatorial', 'Nacional', 'Não se aplica', 180.00, 'ativo'),
(1, 12, 3, 'Geap Hospitalar', 'GEA-HOS', 'Hospitalar', 'Nacional', 'Enfermaria', 480.00, 'ativo'),
(1, 12, 7, 'Geap Referência', 'GEA-REF', 'Referência', 'Nacional', 'Apartamento', 680.00, 'ativo'),
(1, 13, 8, 'Care Plus Executivo', 'CAR-EXE', 'Executivo', 'Nacional', 'Apartamento', 1200.00, 'ativo'),
(1, 13, 25, 'Care Plus Internacional', 'CAR-INT', 'Internacional', 'Internacional', 'Apartamento', 1800.00, 'ativo'),
(1, 14, 9, 'Omint Empresarial', 'OMI-EMP', 'Empresarial', 'Nacional', 'Apartamento', 750.00, 'ativo'),
(1, 14, 12, 'Omint Individual', 'OMI-IND', 'Individual', 'Nacional', 'Enfermaria', 520.00, 'ativo'),
(1, 15, 5, 'Mediservice Odonto Básico', 'MED-ODO-BAS', 'Odontológico', 'Regional', 'Não se aplica', 45.00, 'ativo');

-- Criando 45 faixas etárias para os planos (distribuídas entre os 30 planos)
-- Faixas padrão ANS: 0-18, 19-23, 24-28, 29-33, 34-38, 39-43, 44-48, 49-53, 54-58, 59+
INSERT INTO planos_faixa (id_administradora, plano_id, faixa_etaria, valor, status) VALUES
-- Plano 1: Unimed Ambulatorial Básico
(1, 1, '0-18', 120.00, 'ativo'),
(1, 1, '19-23', 150.00, 'ativo'),
(1, 1, '24-28', 165.00, 'ativo'),
(1, 1, '29-33', 180.00, 'ativo'),
(1, 1, '34-38', 210.00, 'ativo'),
(1, 1, '39-43', 255.00, 'ativo'),
(1, 1, '44-48', 315.00, 'ativo'),
(1, 1, '49-53', 405.00, 'ativo'),
(1, 1, '54-58', 525.00, 'ativo'),
(1, 1, '59+', 735.00, 'ativo'),
-- Plano 3: Unimed Hospitalar com Obstetrícia
(1, 3, '0-18', 360.00, 'ativo'),
(1, 3, '19-23', 450.00, 'ativo'),
(1, 3, '24-28', 495.00, 'ativo'),
(1, 3, '29-33', 540.00, 'ativo'),
(1, 3, '34-38', 630.00, 'ativo'),
-- Plano 6: Amil Executivo
(1, 6, '0-18', 680.00, 'ativo'),
(1, 6, '19-23', 850.00, 'ativo'),
(1, 6, '24-28', 935.00, 'ativo'),
(1, 6, '29-33', 1020.00, 'ativo'),
(1, 6, '34-38', 1190.00, 'ativo'),
-- Plano 8: SulAmérica Corporativo
(1, 8, '0-18', 576.00, 'ativo'),
(1, 8, '19-23', 720.00, 'ativo'),
(1, 8, '24-28', 792.00, 'ativo'),
(1, 8, '29-33', 864.00, 'ativo'),
(1, 8, '34-38', 1008.00, 'ativo'),
-- Plano 10: NotreDame Individual
(1, 10, '0-18', 384.00, 'ativo'),
(1, 10, '19-23', 480.00, 'ativo'),
(1, 10, '24-28', 528.00, 'ativo'),
(1, 10, '29-33', 576.00, 'ativo'),
(1, 10, '34-38', 672.00, 'ativo'),
-- Plano 14: Porto Seguro Oncológico
(1, 14, '0-18', 760.00, 'ativo'),
(1, 14, '19-23', 950.00, 'ativo'),
(1, 14, '24-28', 1045.00, 'ativo'),
(1, 14, '29-33', 1140.00, 'ativo'),
(1, 14, '34-38', 1330.00, 'ativo'),
-- Plano 20: Golden Cross Coparticipação
(1, 20, '0-18', 416.00, 'ativo'),
(1, 20, '19-23', 520.00, 'ativo'),
(1, 20, '24-28', 572.00, 'ativo'),
(1, 20, '29-33', 624.00, 'ativo'),
(1, 20, '34-38', 728.00, 'ativo'),
-- Plano 26: Care Plus Executivo
(1, 26, '0-18', 960.00, 'ativo'),
(1, 26, '19-23', 1200.00, 'ativo'),
(1, 26, '24-28', 1320.00, 'ativo'),
(1, 26, '29-33', 1440.00, 'ativo'),
(1, 26, '34-38', 1680.00, 'ativo');
