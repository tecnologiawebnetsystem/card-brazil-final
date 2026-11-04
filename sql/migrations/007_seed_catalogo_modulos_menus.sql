-- Catálogo inicial completo dos módulos navegáveis do CardBrazil.
-- Idempotente: preserva desativações da administradora e apenas adiciona itens ausentes.
WITH modulos(slug, nome, descricao, ordem) AS (
  VALUES
    ('inicio','Dashboard','Visão geral e atalhos da operação',1),
('cadastros','Cadastros','Administradoras, operadoras, planos e produtos',2),
  ('propostas','Propostas','Cotações, análises e aprovações',3),
  ('beneficiarios','Beneficiários','Cadastro, consulta e movimentação de beneficiários',4),
  ('cobranca','Cobrança','Boletos, pagamentos, inadimplência e remessa',5),
  ('financeiro','Financeiro','Contas, conciliação e fluxo de caixa',6),
    ('contabil','Contábil','Lançamentos, relatórios e demonstrações contábeis',60),
    ('consultas','Consultas','Consultas operacionais e financeiras',70),
('tabelas','Tabelas','Tabelas auxiliares e referências do sistema',7),
  ('relatorios','Relatórios','Relatórios operacionais, financeiros e de vendas',90),
  ('sistemas','Sistemas','Segurança, perfis, auditoria e administração',8),
    ('configuracoes','Configurações','Preferências, comunicação e usuários',110),
    ('utilitarios','Utilitários','Ferramentas e integrações auxiliares',120)
), inseridos AS (
  INSERT INTO sistemas_modulos (slug,nome,descricao,ordem)
  SELECT slug,nome,descricao,ordem FROM modulos
  ON CONFLICT (slug) DO UPDATE SET nome=EXCLUDED.nome,descricao=EXCLUDED.descricao,ordem=EXCLUDED.ordem,updated_at=CURRENT_TIMESTAMP
  RETURNING id,slug
), itens(modulo_slug,slug,titulo,rota,icone,ordem) AS (
  VALUES
    ('inicio','inicio','Dashboard','/dashboard','layout-dashboard',1),
    ('beneficiarios','beneficiarios-consulta','Consulta de beneficiários','/dashboard/beneficiarios/consulta','users',1),('beneficiarios','beneficiarios-inclusao','Inclusão de beneficiário','/dashboard/beneficiarios/inclusao','user-plus',2),('beneficiarios','beneficiarios-titular','Titulares','/dashboard/beneficiarios/titular','user-round',3),('beneficiarios','beneficiarios-dependentes','Dependentes','/dashboard/beneficiarios/dependentes','users-round',4),('beneficiarios','beneficiarios-alteracao','Alteração de beneficiário','/dashboard/beneficiarios/alteracao','user-cog',5),('beneficiarios','beneficiarios-exclusao','Exclusão de beneficiário','/dashboard/beneficiarios/exclusao','user-minus',6),('beneficiarios','beneficiarios-carteirinhas','Carteirinhas','/dashboard/beneficiarios/carteirinhas','contact',7),
    ('propostas','propostas-lista','Lista de propostas','/dashboard/propostas/lista','file-text',1),('propostas','propostas-nova','Nova proposta','/dashboard/propostas/nova','file-plus',2),('propostas','propostas-pendentes','Propostas pendentes','/dashboard/propostas/pendentes','clock-3',3),('propostas','propostas-analise','Análise de propostas','/dashboard/propostas/analise','search-check',4),('propostas','propostas-aprovacao','Aprovação de propostas','/dashboard/propostas/aprovacao','check-check',5),('propostas','propostas-aprovadas','Propostas aprovadas','/dashboard/propostas/aprovadas','badge-check',6),('propostas','cotacao','Cotação','/dashboard/cotacao','calculator',7),
    ('cadastros','administradora','Administradoras','/dashboard/cadastros/administradora','building-2',2),('cadastros','pessoas','Pessoas','/dashboard/pessoas','users-round',3),('cadastros','operadora','Operadoras','/dashboard/cadastros/operadora','briefcase-business',3),('cadastros','estipulante','Estipulantes','/dashboard/cadastros/estipulante','users-round',4),('cadastros','agenciador','Agenciadores','/dashboard/cadastros/agenciador','user-round-plus',5),('cadastros','planos','Planos Faixa','/dashboard/cadastros/planos-faixa','file-spreadsheet',7),('cadastros','produtos','Produtos','/dashboard/cadastros/produtos','package',6),('cadastros','corretor','Corretores','/dashboard/cadastros/corretor','contact-round',7),('cadastros','estipulante','Estipulantes','/dashboard/cadastros/estipulante','landmark',8),('cadastros','subestipulante','Subestipulantes','/dashboard/cadastros/subestipulante','network',9),
    ('cobranca','gerar-boletos','Gerar boletos','/dashboard/cobranca/gerar-boletos','file-plus-2',2),('cobranca','consultar-boletos','Consultar boletos','/dashboard/cobranca/consultar-boletos','file-search',3),('cobranca','parcelas-pendentes','Parcelas pendentes','/dashboard/cobranca/parcelas-pendentes','calendar-clock',4),('cobranca','historico-pagamentos','Histórico de pagamentos','/dashboard/cobranca/historico-pagamentos','history',5),('cobranca','inadimplencia','Inadimplência','/dashboard/cobranca/inadimplencia','triangle-alert',6),('cobranca','remessa','Remessa bancária','/dashboard/remessa','send',7),('cobranca','retorno','Retorno bancário','/dashboard/retorno','download',8),('cobranca','pix','Pix','/dashboard/cobranca/pix','qr-code',9),('cobranca','negociacao-debitos','Negociação de débitos','/dashboard/cobranca/negociacao-debitos','handshake',10),
    ('financeiro','contas-pagar','Contas a pagar','/dashboard/financeiro/contas-pagar','arrow-down-to-line',1),('financeiro','contas-receber','Contas a receber','/dashboard/financeiro/contas-receber','arrow-up-from-line',2),('financeiro','fluxo-caixa','Fluxo de caixa','/dashboard/financeiro/fluxo-caixa','chart-no-axes-combined',3),('financeiro','conciliacao-financeira','Conciliação financeira','/dashboard/financeiro/conciliacao','scale',4),
    ('contabil','lancamentos','Lançamentos contábeis','/dashboard/contabil/lancamentos','book-open',1),('contabil','plano-contas','Plano de contas','/dashboard/contabil/plano-contas','list-tree',2),('contabil','razao','Razão','/dashboard/contabil/razao','file-bar-chart',3),('contabil','balancetes','Balancetes','/dashboard/contabil/balancetes','table-2',4),('contabil','dre','DRE','/dashboard/contabil/dre','chart-column',5),('contabil','balanco-patrimonial','Balanço patrimonial','/dashboard/contabil/balanco-patrimonial','scale-3d',6),
    ('consultas','consulta-pessoas','Consulta de pessoas','/dashboard/consultas/pessoas','search',1),('consultas','consulta-operadoras','Consulta de operadoras','/dashboard/consultas/operadoras','search-check',2),('consultas','consulta-financeira','Consulta financeira','/dashboard/consultas/financeira','search-code',3),
    ('tabelas','bancos-agencias','Bancos e agências','/dashboard/tabelas/bancos-agencias','landmark',1),('tabelas','cep','CEP','/dashboard/tabelas/cep','map-pin',2),('tabelas','cotacao-moedas','Cotação de moedas','/dashboard/tabelas/cotacao-moedas','coins',3),
    ('relatorios','relatorios','Central de relatórios','/dashboard/relatorios','file-chart-column',1),('relatorios','relatorios-financeiro','Relatórios financeiros','/dashboard/relatorios/financeiro','chart-pie',2),('relatorios','relatorios-segurados','Relatórios de segurados','/dashboard/relatorios/segurados','users',3),('relatorios','relatorios-vendas','Relatórios de vendas','/dashboard/relatorios/vendas','trending-up',4),('relatorios','relatorios-inteligentes','Relatórios inteligentes','/dashboard/relatorios/inteligentes','sparkles',5),
    ('sistemas','controle-acesso','Controle de acesso','/dashboard/sistemas/controle-acesso','shield-check',1),('sistemas','perfis-usuario','Perfis de usuário','/dashboard/sistema/perfis','users-round',2),('sistemas','logs-seguranca','Logs de segurança','/dashboard/sistemas/logs-seguranca','file-lock-2',3),('sistemas','perfis','Perfis','/dashboard/sistema/perfis','shield',4),('sistemas','alcadas','Alçadas','/dashboard/sistema/alcadas','git-branch',5),('sistemas','sql-manager','SQL Manager','/dashboard/sql-manager','table-properties',7),
    ('configuracoes','configuracoes','Configurações gerais','/dashboard/configuracoes','settings',1),('configuracoes','usuarios','Usuários','/dashboard/configuracoes/usuarios','user-cog',2),('configuracoes','permissoes','Permissões','/dashboard/configuracoes/permissoes','key-round',3),('configuracoes','personalizacao','Personalização','/dashboard/configuracoes/personalizacao','palette',4),('configuracoes','email','Configurações de e-mail','/dashboard/configuracoes/email','mail',5),('configuracoes','sms','Configurações de SMS','/dashboard/configuracoes/sms','message-square',6),('configuracoes','impressao','Impressão','/dashboard/configuracoes/impressao','printer',7),
    ('utilitarios','auditoria','Auditoria','/dashboard/auditoria','clipboard-check',1),('utilitarios','notificacoes','Notificações','/dashboard/notificacoes','bell',2),('utilitarios','sinistros','Sinistros','/dashboard/sinistros','file-warning',3),('utilitarios','ans','ANS','/dashboard/ans','file-check-2',4),('utilitarios','ajuda','Ajuda','/dashboard/ajuda','circle-help',5)
), menu_inseridos AS (
  INSERT INTO sistemas_menus (modulo_id,slug,titulo,rota,icone,ordem)
  SELECT mo.id,i.slug,i.titulo,i.rota,i.icone,i.ordem FROM itens i JOIN sistemas_modulos mo ON mo.slug=i.modulo_slug
  ON CONFLICT (slug) DO UPDATE SET titulo=EXCLUDED.titulo,rota=EXCLUDED.rota,icone=EXCLUDED.icone,ordem=EXCLUDED.ordem,modulo_id=EXCLUDED.modulo_id,ativo=TRUE,updated_at=CURRENT_TIMESTAMP
  RETURNING id
)
SELECT (SELECT COUNT(*) FROM inseridos) AS modulos_sincronizados, (SELECT COUNT(*) FROM menu_inseridos) AS menus_sincronizados;

-- Inserção separada: CTEs de dados modificadores não enxergam linhas inseridas por outra CTE.
INSERT INTO sistemas_menus (modulo_id, slug, titulo, rota, icone, ordem)
SELECT mo.id, item.slug, item.titulo, item.rota, item.icone, item.ordem
FROM sistemas_modulos mo
JOIN jsonb_to_recordset('[
  {"modulo":"inicio","slug":"inicio","titulo":"Início","rota":"/dashboard","icone":"layout-dashboard","ordem":1},
  {"modulo":"beneficiarios","slug":"beneficiarios-consulta","titulo":"Consulta de beneficiários","rota":"/dashboard/beneficiarios/consulta","icone":"users","ordem":1},
  {"modulo":"beneficiarios","slug":"beneficiarios-inclusao","titulo":"Inclusão de beneficiário","rota":"/dashboard/beneficiarios/inclusao","icone":"user-plus","ordem":2},
  {"modulo":"propostas","slug":"propostas-lista","titulo":"Lista de propostas","rota":"/dashboard/propostas/lista","icone":"file-text","ordem":1},
  {"modulo":"propostas","slug":"propostas-nova","titulo":"Nova proposta","rota":"/dashboard/propostas/nova","icone":"file-plus","ordem":2},
  {"modulo":"cadastros","slug":"cadastros","titulo":"Cadastros","rota":"/dashboard/cadastros","icone":"database","ordem":1},
  {"modulo":"cadastros","slug":"operadora","titulo":"Operadoras","rota":"/dashboard/cadastros/operadora","icone":"briefcase-business","ordem":2},
  {"modulo":"cadastros","slug":"planos","titulo":"Planos","rota":"/dashboard/cadastros/planos","icone":"layers-3","ordem":3},
  {"modulo":"cobranca","slug":"cobranca","titulo":"Cobrança","rota":"/dashboard/cobranca","icone":"receipt","ordem":1},
  {"modulo":"cobranca","slug":"gerar-boletos","titulo":"Gerar boletos","rota":"/dashboard/cobranca/gerar-boletos","icone":"file-plus-2","ordem":2},
  {"modulo":"cobranca","slug":"inadimplencia","titulo":"Inadimplência","rota":"/dashboard/cobranca/inadimplencia","icone":"triangle-alert","ordem":3},
  {"modulo":"financeiro","slug":"contas-pagar","titulo":"Contas a pagar","rota":"/dashboard/financeiro/contas-pagar","icone":"arrow-down-to-line","ordem":1},
  {"modulo":"financeiro","slug":"contas-receber","titulo":"Contas a receber","rota":"/dashboard/financeiro/contas-receber","icone":"arrow-up-from-line","ordem":2},
  {"modulo":"contabil","slug":"lancamentos","titulo":"Lançamentos contábeis","rota":"/dashboard/contabil/lancamentos","icone":"book-open","ordem":1},
  {"modulo":"contabil","slug":"plano-contas","titulo":"Plano de contas","rota":"/dashboard/contabil/plano-contas","icone":"list-tree","ordem":2},
  {"modulo":"consultas","slug":"consulta-pessoas","titulo":"Consulta de pessoas","rota":"/dashboard/consultas/pessoas","icone":"search","ordem":1},
  {"modulo":"tabelas","slug":"bancos-agencias","titulo":"Bancos e agências","rota":"/dashboard/tabelas/bancos-agencias","icone":"landmark","ordem":1},
  {"modulo":"relatorios","slug":"relatorios","titulo":"Central de relatórios","rota":"/dashboard/relatorios","icone":"file-chart-column","ordem":1},
  {"modulo":"sistemas","slug":"controle-acesso","titulo":"Controle de acesso","rota":"/dashboard/sistemas/controle-acesso","icone":"shield-check","ordem":1},
  {"modulo":"sistemas","slug":"perfis-usuario","titulo":"Perfis de usuário","rota":"/dashboard/sistemas/perfis-usuario","icone":"users-round","ordem":2},
  {"modulo":"configuracoes","slug":"configuracoes","titulo":"Configurações gerais","rota":"/dashboard/configuracoes","icone":"settings","ordem":1},
  {"modulo":"configuracoes","slug":"usuarios","titulo":"Usuários","rota":"/dashboard/configuracoes/usuarios","icone":"user-cog","ordem":2},
  {"modulo":"utilitarios","slug":"auditoria","titulo":"Auditoria","rota":"/dashboard/auditoria","icone":"clipboard-check","ordem":1}
]'::jsonb) AS item(slug text, titulo text, rota text, icone text, ordem int, modulo text) ON mo.slug = item.modulo
ON CONFLICT (slug) DO UPDATE SET titulo = EXCLUDED.titulo, rota = EXCLUDED.rota, icone = EXCLUDED.icone, ordem = EXCLUDED.ordem, modulo_id = EXCLUDED.modulo_id, ativo = TRUE, updated_at = CURRENT_TIMESTAMP;
