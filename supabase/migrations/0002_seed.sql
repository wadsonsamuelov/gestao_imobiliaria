-- ============================================================================
-- SEED — dados de exemplo, os mesmos do protótipo visual, para você
-- reconhecer o sistema de cara. Rode depois de criar seus 2 usuários
-- no Supabase Auth (veja o README).
-- ============================================================================

insert into organizations (id, name) values
  ('00000000-0000-0000-0000-000000000001', 'Cadastre — Administração Imobiliária');

-- Proprietários
insert into owners (id, organization_id, name, document, phone) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Thomas Kane', '000.111.222-33', '(00) 0000-0021'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Martha Fenwick', '000.222.333-44', '(00) 0000-0022'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Construtora Argos Ltda.', '00.333.444/0001-55', '(00) 0000-0023');

-- Imóveis
insert into properties (id, organization_id, code, title, address, type, area_m2, owner_id, status, rent_value, iptu_value, condo_value) values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'IM-014', 'Edifício Aurora, Apto 302', 'SQN 214 Bloco A, Asa Norte, Brasília/DF', 'apartamento', 86, '10000000-0000-0000-0000-000000000001', 'ocupado', 3200, 210, 480),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'IM-015', 'Casa Jardim Botânico', 'QI 12, Lago Sul, Brasília/DF', 'casa', 240, '10000000-0000-0000-0000-000000000002', 'vago', 6800, 540, null),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'IM-016', 'Sala Comercial 1204', 'SCS Quadra 6, Ed. Business Center, Brasília/DF', 'comercial', 52, '10000000-0000-0000-0000-000000000003', 'ocupado', 4100, 300, 650),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'IM-017', 'Studio Águas Claras', 'Rua 15 Norte, Águas Claras, Brasília/DF', 'apartamento', 34, '10000000-0000-0000-0000-000000000001', 'manutencao', 1850, 95, 320),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'IM-018', 'Cobertura Sudoeste', 'SQSW 302, Bloco C, Brasília/DF', 'apartamento', 160, '10000000-0000-0000-0000-000000000002', 'ocupado', 7400, 610, 890),
  ('20000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'IM-019', 'Galpão Setor de Indústria', 'SIA Trecho 4, Brasília/DF', 'industrial', 980, '10000000-0000-0000-0000-000000000003', 'vago', 12500, 1100, null);

-- Documentos padrão por imóvel
insert into property_documents (property_id, name, required, received)
select id, doc, true, false
from properties, unnest(array['Matrícula atualizada','IPTU quitado','Habite-se','Certidão negativa de débitos condominiais','Laudo de vistoria vigente']) as doc;

-- Inquilinos
insert into tenants (id, organization_id, name, document, phone, income) values
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Alana Ferraz', '000.444.555-66', '(00) 0000-0001', 9400),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Escritório Bastos & Nery', '00.555.666/0001-77', '(00) 0000-0002', null),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Rafael Monteiro', '000.666.777-88', '(00) 0000-0003', 18200);

-- Contratos
insert into contracts (id, organization_id, property_id, tenant_id, owner_id, rent_value, start_date, duration_months, due_day, adjustment_index, late_fee_pct, interest_pct_month, guarantee_type) values
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 3200, '2025-03-14', 30, 10, 'IGPM', 2, 1, 'caucao'),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 4100, '2024-08-02', 24, 5, 'IPCA', 2, 1, 'seguro_fianca'),
  ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 7400, '2025-11-30', 30, 12, 'IGPM', 2, 1, 'fiador');

insert into contract_obligations (contract_id, description, checked)
select id, obligation, true
from contracts, unnest(array[
  'Pagar o aluguel e encargos até a data de vencimento',
  'Zelar pela conservação do imóvel',
  'Comunicar avarias e sinistros imediatamente',
  'Permitir vistorias periódicas mediante aviso prévio'
]) as obligation;

-- Boletos
insert into boletos (organization_id, contract_id, value, due_date, status, paid_at) values
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 3200, '2026-07-10', 'pago', '2026-07-09'),
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 4100, '2026-07-05', 'atrasado', null),
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', 7400, '2026-07-12', 'pago', '2026-07-11'),
  ('00000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 3200, '2026-08-10', 'a_vencer', null);

-- Prestadores
insert into providers (id, organization_id, name, specialty, phone, rating) values
  ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Caio Bezerra — Hidráulica Bezerra', 'Encanador', '(00) 0000-0011', 4.8),
  ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Elétrica Confiança Ltda.', 'Elétrica', '(00) 0000-0012', 4.6),
  ('50000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Beatriz Lemos Pinturas', 'Pintura', '(00) 0000-0013', 5.0);

-- Gastos
insert into expenses (organization_id, property_id, description, category, value, expense_date, paid_by, provider_id) values
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', 'Manutenção do telhado', 'manutencao', 2400, '2026-06-22', 'proprietario', null),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Reparo de vazamento', 'hidraulica', 380, '2026-06-02', 'administradora', '50000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', 'Pintura completa', 'reforma', 3100, '2026-06-27', 'proprietario', '50000000-0000-0000-0000-000000000003');

-- Histórico
insert into property_history (organization_id, property_id, event_date, title, description, event_type) values
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', '2026-06-27', 'Pintura completa realizada', 'Serviço executado por Beatriz Lemos Pinturas — R$ 3.100,00, custeado pelo proprietário.', 'reforma'),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000004', '2026-01-20', 'Vistoria de saída — inquilino anterior', 'Sem pendências. Depósito caução devolvido integralmente.', 'vistoria');

-- ============================================================================
-- Depois de criar seus 2 usuários no painel do Supabase (Authentication > Users),
-- rode isto substituindo os UUIDs pelos IDs reais gerados:
--
-- update profiles set organization_id = '00000000-0000-0000-0000-000000000001',
--   full_name = 'Bruce Wayne', role = 'admin'
--   where id = 'UUID_DO_PRIMEIRO_USUARIO';
--
-- update profiles set organization_id = '00000000-0000-0000-0000-000000000001',
--   full_name = 'NOME_DA_SEGUNDA_PESSOA', role = 'gestor'
--   where id = 'UUID_DO_SEGUNDO_USUARIO';
-- ============================================================================
