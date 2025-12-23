-- =============================================
-- Script: 04_pessoas_teste.sql
-- Descrição: Cadastro de 60 pessoas para testes (15 PF + 45 PJ)
-- Database: cardbrazil
-- =============================================

USE cardbrazil;

-- Corrigindo campos: sexo -> genero, cpf_cnpj -> cpf (para PF) e cnpj (para PJ)

-- ========== PESSOAS FÍSICAS (15) ==========
INSERT INTO pessoas (id_administradora, tipo_pessoa, nome, cpf, data_nascimento, genero, estado_civil, email, telefone, celular, status) VALUES
(1, 'fisica', 'João Silva Santos', '12345678901', '1985-03-15', 'masculino', 'casado', 'joao.silva@email.com', '1133334444', '11987654321', 'ativo'),
(1, 'fisica', 'Maria Oliveira Costa', '23456789012', '1990-07-22', 'feminino', 'solteiro', 'maria.oliveira@email.com', '1133335555', '11987654322', 'ativo'),
(1, 'fisica', 'Pedro Henrique Souza', '34567890123', '1988-11-10', 'masculino', 'casado', 'pedro.souza@email.com', '1133336666', '11987654323', 'ativo'),
(1, 'fisica', 'Ana Paula Ferreira', '45678901234', '1992-05-18', 'feminino', 'divorciado', 'ana.ferreira@email.com', '1133337777', '11987654324', 'ativo'),
(1, 'fisica', 'Carlos Eduardo Lima', '56789012345', '1987-09-25', 'masculino', 'casado', 'carlos.lima@email.com', '1133338888', '11987654325', 'ativo'),
(1, 'fisica', 'Juliana Martins Rocha', '67890123456', '1995-01-30', 'feminino', 'solteiro', 'juliana.rocha@email.com', '1133339999', '11987654326', 'ativo'),
(1, 'fisica', 'Ricardo Alves Pereira', '78901234567', '1983-12-05', 'masculino', 'casado', 'ricardo.pereira@email.com', '1133330000', '11987654327', 'ativo'),
(1, 'fisica', 'Fernanda Costa Ribeiro', '89012345678', '1991-08-14', 'feminino', 'solteiro', 'fernanda.ribeiro@email.com', '1133331111', '11987654328', 'ativo'),
(1, 'fisica', 'Marcos Vinícius Dias', '90123456789', '1986-04-20', 'masculino', 'divorciado', 'marcos.dias@email.com', '1133332222', '11987654329', 'ativo'),
(1, 'fisica', 'Patrícia Gomes Silva', '01234567890', '1993-10-08', 'feminino', 'casado', 'patricia.gomes@email.com', '1133333333', '11987654330', 'ativo'),
(1, 'fisica', 'Roberto Carlos Mendes', '11234567890', '1984-06-12', 'masculino', 'solteiro', 'roberto.mendes@email.com', '1133334455', '11987654331', 'ativo'),
(1, 'fisica', 'Camila Rodrigues Almeida', '22345678901', '1994-02-28', 'feminino', 'casado', 'camila.almeida@email.com', '1133335566', '11987654332', 'ativo'),
(1, 'fisica', 'Felipe Augusto Barbosa', '33456789012', '1989-07-16', 'masculino', 'solteiro', 'felipe.barbosa@email.com', '1133336677', '11987654333', 'ativo'),
(1, 'fisica', 'Larissa Beatriz Santos', '44567890123', '1996-11-22', 'feminino', 'solteiro', 'larissa.santos@email.com', '1133337788', '11987654334', 'ativo'),
(1, 'fisica', 'Thiago Henrique Cardoso', '55678901234', '1982-03-09', 'masculino', 'casado', 'thiago.cardoso@email.com', '1133338899', '11987654335', 'ativo');

-- ========== PESSOAS JURÍDICAS (45) ==========
INSERT INTO pessoas (id_administradora, tipo_pessoa, razao_social, nome_fantasia, cnpj, inscricao_estadual, inscricao_municipal, email, telefone, celular, status) VALUES
(1, 'juridica', 'Tech Solutions Tecnologia Ltda', 'Tech Solutions', '12345678000190', '123456789', '987654321', 'contato@techsolutions.com.br', '1133334444', '11987651001', 'ativo'),
(1, 'juridica', 'Comercial Alvorada Distribuidora Ltda', 'Alvorada', '23456789000191', '234567890', '987654322', 'contato@alvorada.com.br', '1133335555', '11987651002', 'ativo'),
(1, 'juridica', 'Indústria Moderna Sociedade Anônima', 'Moderna', '34567890000192', '345678901', '987654323', 'contato@moderna.com.br', '1133336666', '11987651003', 'ativo'),
(1, 'juridica', 'Serviços Integrados Empresariais Ltda', 'Integrados', '45678901000193', '456789012', '987654324', 'contato@integrados.com.br', '1133337777', '11987651004', 'ativo'),
(1, 'juridica', 'Construtora Horizonte Engenharia Ltda', 'Horizonte', '56789012000194', '567890123', '987654325', 'contato@horizonte.com.br', '1133338888', '11987651005', 'ativo'),
(1, 'juridica', 'Transportadora Rápida Logística Ltda', 'Rápida', '67890123000195', '678901234', '987654326', 'contato@rapida.com.br', '1133339999', '11987651006', 'ativo'),
(1, 'juridica', 'Consultoria Empresarial Estratégica Ltda', 'Consultoria', '78901234000196', '789012345', '987654327', 'contato@consultoria.com.br', '1133330000', '11987651007', 'ativo'),
(1, 'juridica', 'Farmácia Saúde Total Medicamentos Ltda', 'Saúde Total', '89012345000197', '890123456', '987654328', 'contato@saudetotal.com.br', '1133331111', '11987651008', 'ativo'),
(1, 'juridica', 'Supermercado Bom Preço Alimentos Ltda', 'Bom Preço', '90123456000198', '901234567', '987654329', 'contato@bompreco.com.br', '1133332222', '11987651009', 'ativo'),
(1, 'juridica', 'Escola Futuro Brilhante Educação Ltda', 'Futuro Brilhante', '01234567000199', '012345678', '987654330', 'contato@futurobrilhante.com.br', '1133333333', '11987651010', 'ativo'),
(1, 'juridica', 'Clínica Médica Vida Saúde Ltda', 'Vida', '11234567000100', '112345678', '987654331', 'contato@vida.com.br', '1133334455', '11987651011', 'ativo'),
(1, 'juridica', 'Restaurante Sabor & Arte Gastronomia Ltda', 'Sabor & Arte', '22345678000101', '223456789', '987654332', 'contato@saborarte.com.br', '1133335566', '11987651012', 'ativo'),
(1, 'juridica', 'Hotel Estrela do Sul Hospedagem Ltda', 'Estrela do Sul', '33456789000102', '334567890', '987654333', 'contato@estreladosul.com.br', '1133336677', '11987651013', 'ativo'),
(1, 'juridica', 'Academia Corpo Saudável Fitness Ltda', 'Corpo Saudável', '44567890000103', '445678901', '987654334', 'contato@corposaudavel.com.br', '1133337788', '11987651014', 'ativo'),
(1, 'juridica', 'Imobiliária Prime Negócios Ltda', 'Prime', '55678901000104', '556789012', '987654335', 'contato@prime.com.br', '1133338899', '11987651015', 'ativo'),
(1, 'juridica', 'Advocacia Silva & Associados Ltda', 'Silva Advogados', '66789012000105', '667890123', '987654336', 'contato@silvaadvogados.com.br', '1133339900', '11987651016', 'ativo'),
(1, 'juridica', 'Contabilidade Exata Serviços Ltda', 'Exata', '77890123000106', '778901234', '987654337', 'contato@exata.com.br', '1133330011', '11987651017', 'ativo'),
(1, 'juridica', 'Gráfica Impressão Perfeita Ltda', 'Impressão Perfeita', '88901234000107', '889012345', '987654338', 'contato@impressaoperfeita.com.br', '1133331122', '11987651018', 'ativo'),
(1, 'juridica', 'Oficina Mecânica Turbo Auto Center Ltda', 'Turbo', '99012345000108', '990123456', '987654339', 'contato@turbo.com.br', '1133332233', '11987651019', 'ativo'),
(1, 'juridica', 'Lavanderia Clean Express Serviços Ltda', 'Clean Express', '00123456000109', '001234567', '987654340', 'contato@cleanexpress.com.br', '1133333344', '11987651020', 'ativo'),
(1, 'juridica', 'Petshop Amigo Fiel Animais Ltda', 'Amigo Fiel', '10234567000110', '102345678', '987654341', 'contato@amigofiel.com.br', '1133334466', '11987651021', 'ativo'),
(1, 'juridica', 'Floricultura Jardim das Flores Ltda', 'Jardim das Flores', '20345678000111', '203456789', '987654342', 'contato@jardimdasflores.com.br', '1133335577', '11987651022', 'ativo'),
(1, 'juridica', 'Padaria Pão Quente Alimentos Ltda', 'Pão Quente', '30456789000112', '304567890', '987654343', 'contato@paoquente.com.br', '1133336688', '11987651023', 'ativo'),
(1, 'juridica', 'Livraria Saber & Cultura Livros Ltda', 'Saber & Cultura', '40567890000113', '405678901', '987654344', 'contato@sabercultura.com.br', '1133337799', '11987651024', 'ativo'),
(1, 'juridica', 'Joalheria Brilho Eterno Jóias Ltda', 'Brilho Eterno', '50678901000114', '506789012', '987654345', 'contato@brilhoeterno.com.br', '1133338800', '11987651025', 'ativo'),
(1, 'juridica', 'Ótica Visão Clara Produtos Ltda', 'Visão Clara', '60789012000115', '607890123', '987654346', 'contato@visaoclara.com.br', '1133339911', '11987651026', 'ativo'),
(1, 'juridica', 'Salão de Beleza Glamour Estética Ltda', 'Glamour', '70890123000116', '708901234', '987654347', 'contato@glamour.com.br', '1133330022', '11987651027', 'ativo'),
(1, 'juridica', 'Agência de Viagens Mundo Tour Ltda', 'Mundo Tour', '80901234000117', '809012345', '987654348', 'contato@mundotour.com.br', '1133331133', '11987651028', 'ativo'),
(1, 'juridica', 'Seguradora Proteção Total Seguros Ltda', 'Proteção Total', '90012345000118', '900123456', '987654349', 'contato@protecaototal.com.br', '1133332244', '11987651029', 'ativo'),
(1, 'juridica', 'Banco Digital Futuro Financeira SA', 'Futuro Bank', '00234567000119', '002345678', '987654350', 'contato@futurobanco.com.br', '1133333355', '11987651030', 'ativo'),
(1, 'juridica', 'Corretora de Imóveis Lar Ideal Ltda', 'Lar Ideal', '10345678000120', '103456789', '987654351', 'contato@larideal.com.br', '1133334477', '11987651031', 'ativo'),
(1, 'juridica', 'Empresa de Limpeza Brilho Total Ltda', 'Brilho Total', '20456789000121', '204567890', '987654352', 'contato@brilhototal.com.br', '1133335588', '11987651032', 'ativo'),
(1, 'juridica', 'Distribuidora de Bebidas Refrescar Ltda', 'Refrescar', '30567890000122', '305678901', '987654353', 'contato@refrescar.com.br', '1133336699', '11987651033', 'ativo'),
(1, 'juridica', 'Fábrica de Móveis Design Moderno Ltda', 'Design Moderno', '40678901000123', '406789012', '987654354', 'contato@designmoderno.com.br', '1133337700', '11987651034', 'ativo'),
(1, 'juridica', 'Laboratório de Análises Clínicas Precisão Ltda', 'Precisão', '50789012000124', '507890123', '987654355', 'contato@precisao.com.br', '1133338811', '11987651035', 'ativo'),
(1, 'juridica', 'Centro de Treinamento Capacitar Educação Ltda', 'Capacitar', '60890123000125', '608901234', '987654356', 'contato@capacitar.com.br', '1133339922', '11987651036', 'ativo'),
(1, 'juridica', 'Empresa de Segurança Vigilância 24h Ltda', 'Vigilância 24h', '70901234000126', '709012345', '987654357', 'contato@vigilancia24h.com.br', '1133330033', '11987651037', 'ativo'),
(1, 'juridica', 'Posto de Combustível Auto Posto Ltda', 'Auto Posto', '80012345000127', '800123456', '987654358', 'contato@autoposto.com.br', '1133331144', '11987651038', 'ativo'),
(1, 'juridica', 'Concessionária Veículos Premium Ltda', 'Premium', '90123456000128', '901234567', '987654359', 'contato@premium.com.br', '1133332255', '11987651039', 'ativo'),
(1, 'juridica', 'Empresa de Eventos Festa Perfeita Ltda', 'Festa Perfeita', '00345678000129', '003456789', '987654360', 'contato@festaperfeita.com.br', '1133333366', '11987651040', 'ativo'),
(1, 'juridica', 'Clínica Veterinária Pet Care Ltda', 'Pet Care', '10456789000130', '104567890', '987654361', 'contato@petcare.com.br', '1133334488', '11987651041', 'ativo'),
(1, 'juridica', 'Empresa de TI Soluções Digitais Ltda', 'Soluções Digitais', '20567890000131', '205678901', '987654362', 'contato@solucoesdigitais.com.br', '1133335599', '11987651042', 'ativo'),
(1, 'juridica', 'Fábrica de Alimentos Sabor Natural Ltda', 'Sabor Natural', '30678901000132', '306789012', '987654363', 'contato@sabornatural.com.br', '1133336600', '11987651043', 'ativo'),
(1, 'juridica', 'Empresa de Telecomunicações ConectaMais Ltda', 'ConectaMais', '40789012000133', '407890123', '987654364', 'contato@conectamais.com.br', '1133337711', '11987651044', 'ativo'),
(1, 'juridica', 'Indústria Química Fórmula Certa Ltda', 'Fórmula Certa', '50890123000134', '508901234', '987654365', 'contato@formulacerta.com.br', '1133338822', '11987651045', 'ativo');
