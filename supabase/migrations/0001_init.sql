-- ============================================================================
-- CADASTRE — schema inicial
-- Estrutura pronta para multi-tenant: toda tabela de dados carrega
-- organization_id. Hoje você terá 1 organização (você + 1 pessoa),
-- mas a estrutura já suporta múltiplas imobiliárias sem refatoração.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- ORGANIZAÇÕES E PERFIS
-- ----------------------------------------------------------------------------
create table organizations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  created_at    timestamptz not null default now()
);

create type user_role as enum ('admin', 'gestor');

-- profiles espelha auth.users (Supabase Auth) e adiciona organização + papel
create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  organization_id   uuid references organizations(id) on delete set null,
  full_name         text not null,
  role              user_role not null default 'gestor',
  created_at        timestamptz not null default now()
);

-- cria automaticamente um profile vazio quando alguém se cadastra no Auth
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- função auxiliar usada em todas as policies abaixo
create or replace function my_organization_id()
returns uuid as $$
  select organization_id from profiles where id = auth.uid();
$$ language sql stable security definer;

-- ----------------------------------------------------------------------------
-- PROPRIETÁRIOS
-- ----------------------------------------------------------------------------
create table owners (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  name              text not null,
  document          text,           -- CPF ou CNPJ
  phone             text,
  email             text,
  notes             text,
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- IMÓVEIS
-- ----------------------------------------------------------------------------
create type property_type as enum ('apartamento', 'casa', 'comercial', 'industrial', 'terreno');
create type property_status as enum ('ocupado', 'vago', 'manutencao');

create table properties (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  code              text not null,              -- ex: IM-014
  title             text not null,
  address           text not null,
  type              property_type not null default 'apartamento',
  area_m2           numeric(10,2),
  owner_id          uuid references owners(id) on delete set null,
  status            property_status not null default 'vago',
  rent_value        numeric(12,2),
  iptu_value        numeric(12,2),
  condo_value       numeric(12,2),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (organization_id, code)
);

create table property_documents (
  id                uuid primary key default gen_random_uuid(),
  property_id       uuid not null references properties(id) on delete cascade,
  name              text not null,              -- ex: "Matrícula atualizada"
  required          boolean not null default true,
  received          boolean not null default false,
  received_at       date,
  file_url          text
);

-- ----------------------------------------------------------------------------
-- INQUILINOS
-- ----------------------------------------------------------------------------
create table tenants (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  name              text not null,
  document          text,                       -- CPF ou CNPJ
  phone             text,
  email             text,
  profession        text,
  income            numeric(12,2),
  marital_status    text,
  created_at        timestamptz not null default now()
);

create table tenant_documents (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references tenants(id) on delete cascade,
  name              text not null,              -- ex: "Comprovante de renda"
  required          boolean not null default true,
  received          boolean not null default false,
  received_at       date,
  file_url          text
);

-- ----------------------------------------------------------------------------
-- CONTRATOS
-- ----------------------------------------------------------------------------
create type adjustment_index as enum ('IGPM', 'IPCA', 'INPC');
create type guarantee_type as enum ('caucao', 'fiador', 'seguro_fianca', 'titulo_capitalizacao');
create type contract_status as enum ('ativo', 'encerrado', 'renovacao');

create table contracts (
  id                    uuid primary key default gen_random_uuid(),
  organization_id       uuid not null references organizations(id) on delete cascade,
  property_id           uuid not null references properties(id) on delete restrict,
  tenant_id             uuid not null references tenants(id) on delete restrict,
  owner_id              uuid references owners(id) on delete set null,
  rent_value            numeric(12,2) not null,
  start_date            date not null,
  duration_months       int not null default 30,
  due_day               int not null default 10,
  adjustment_index      adjustment_index not null default 'IGPM',
  late_fee_pct          numeric(5,2) not null default 2,     -- multa contratual (%)
  interest_pct_month    numeric(5,2) not null default 1,     -- juros de mora (% a.m.)
  guarantee_type        guarantee_type not null default 'caucao',
  guarantor_name        text,
  special_clauses       text,
  status                contract_status not null default 'ativo',
  created_at            timestamptz not null default now()
);

create table contract_obligations (
  id                uuid primary key default gen_random_uuid(),
  contract_id       uuid not null references contracts(id) on delete cascade,
  description       text not null,
  checked           boolean not null default false
);

-- ----------------------------------------------------------------------------
-- FINANCEIRO: BOLETOS E GASTOS
-- ----------------------------------------------------------------------------
create type boleto_status as enum ('pago', 'atrasado', 'a_vencer');

create table boletos (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  contract_id       uuid not null references contracts(id) on delete cascade,
  value             numeric(12,2) not null,
  due_date          date not null,
  status            boleto_status not null default 'a_vencer',
  paid_at           date,
  created_at        timestamptz not null default now()
);

create type expense_category as enum ('manutencao', 'reforma', 'hidraulica', 'eletrica', 'vidracaria', 'outros');
create type paid_by_type as enum ('proprietario', 'inquilino', 'administradora');

create table expenses (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  property_id       uuid not null references properties(id) on delete cascade,
  description       text not null,
  category          expense_category not null default 'outros',
  value             numeric(12,2) not null,
  expense_date      date not null default current_date,
  paid_by           paid_by_type not null default 'administradora',
  provider_id       uuid,   -- referência opcional a providers, fk criada abaixo
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- VISTORIAS
-- ----------------------------------------------------------------------------
create type inspection_type as enum ('entrada', 'periodica', 'saida');
create type inspection_status as enum ('agendada', 'concluida');
create type item_condition as enum ('bom', 'regular', 'ruim', 'pendente');

create table inspections (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  property_id       uuid not null references properties(id) on delete cascade,
  type              inspection_type not null default 'periodica',
  inspection_date   date not null default current_date,
  status            inspection_status not null default 'agendada',
  notes             text,
  created_at        timestamptz not null default now()
);

create table inspection_photos (
  id                uuid primary key default gen_random_uuid(),
  inspection_id     uuid not null references inspections(id) on delete cascade,
  url               text not null,
  caption           text,
  created_at        timestamptz not null default now()
);

create table inspection_checklist_items (
  id                uuid primary key default gen_random_uuid(),
  inspection_id     uuid not null references inspections(id) on delete cascade,
  item              text not null,
  state             item_condition not null default 'pendente'
);

-- ----------------------------------------------------------------------------
-- ENTREGA DE CHAVES
-- ----------------------------------------------------------------------------
create type key_event_type as enum ('entrega', 'devolucao');
create type key_status as enum ('entregue', 'devolvida');

create table key_movements (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  property_id       uuid not null references properties(id) on delete cascade,
  event_type        key_event_type not null,
  person_name       text not null,
  movement_date     date not null default current_date,
  status            key_status not null,
  notes             text,
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- PRESTADORES DE SERVIÇO
-- ----------------------------------------------------------------------------
create table providers (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  name              text not null,
  specialty         text,
  phone             text,
  document          text,
  rating            numeric(2,1),
  notes             text,
  created_at        timestamptz not null default now()
);

alter table expenses
  add constraint expenses_provider_fk foreign key (provider_id) references providers(id) on delete set null;

create table service_records (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  provider_id       uuid not null references providers(id) on delete cascade,
  property_id       uuid not null references properties(id) on delete cascade,
  description       text not null,
  service_date      date not null default current_date,
  value             numeric(12,2),
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- HISTÓRICO DO IMÓVEL (linha do tempo, para garantias e disputas)
-- ----------------------------------------------------------------------------
create type history_event_type as enum ('reforma', 'pagamento', 'mudanca_inquilino', 'reajuste', 'vistoria', 'outro');

create table property_history (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  property_id       uuid not null references properties(id) on delete cascade,
  event_date        date not null default current_date,
  title             text not null,
  description       text,
  event_type        history_event_type not null default 'outro',
  created_at        timestamptz not null default now()
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================
create index on owners (organization_id);
create index on properties (organization_id);
create index on tenants (organization_id);
create index on contracts (organization_id);
create index on contracts (property_id);
create index on contracts (tenant_id);
create index on boletos (organization_id);
create index on boletos (contract_id);
create index on expenses (organization_id);
create index on expenses (property_id);
create index on inspections (organization_id);
create index on key_movements (organization_id);
create index on providers (organization_id);
create index on service_records (organization_id);
create index on property_history (organization_id);
create index on property_history (property_id);

-- ============================================================================
-- ROW LEVEL SECURITY — cada organização só enxerga seus próprios dados
-- ============================================================================
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table owners enable row level security;
alter table properties enable row level security;
alter table property_documents enable row level security;
alter table tenants enable row level security;
alter table tenant_documents enable row level security;
alter table contracts enable row level security;
alter table contract_obligations enable row level security;
alter table boletos enable row level security;
alter table expenses enable row level security;
alter table inspections enable row level security;
alter table inspection_photos enable row level security;
alter table inspection_checklist_items enable row level security;
alter table key_movements enable row level security;
alter table providers enable row level security;
alter table service_records enable row level security;
alter table property_history enable row level security;

create policy "ver própria organização" on organizations
  for select using (id = my_organization_id());

create policy "ver e editar o próprio perfil" on profiles
  for select using (id = auth.uid() or organization_id = my_organization_id());
create policy "atualizar o próprio perfil" on profiles
  for update using (id = auth.uid());

-- tabelas diretamente organization_id: mesma regra repetida
create policy "acesso por organização" on owners
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());
create policy "acesso por organização" on properties
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());
create policy "acesso por organização" on tenants
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());
create policy "acesso por organização" on contracts
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());
create policy "acesso por organização" on boletos
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());
create policy "acesso por organização" on expenses
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());
create policy "acesso por organização" on inspections
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());
create policy "acesso por organização" on key_movements
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());
create policy "acesso por organização" on providers
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());
create policy "acesso por organização" on service_records
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());
create policy "acesso por organização" on property_history
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());

-- tabelas filhas (sem organization_id direto): acesso via a tabela pai
create policy "acesso via imóvel" on property_documents
  for all using (property_id in (select id from properties where organization_id = my_organization_id()))
  with check (property_id in (select id from properties where organization_id = my_organization_id()));

create policy "acesso via inquilino" on tenant_documents
  for all using (tenant_id in (select id from tenants where organization_id = my_organization_id()))
  with check (tenant_id in (select id from tenants where organization_id = my_organization_id()));

create policy "acesso via contrato" on contract_obligations
  for all using (contract_id in (select id from contracts where organization_id = my_organization_id()))
  with check (contract_id in (select id from contracts where organization_id = my_organization_id()));

create policy "acesso via vistoria" on inspection_photos
  for all using (inspection_id in (select id from inspections where organization_id = my_organization_id()))
  with check (inspection_id in (select id from inspections where organization_id = my_organization_id()));

create policy "acesso via vistoria" on inspection_checklist_items
  for all using (inspection_id in (select id from inspections where organization_id = my_organization_id()))
  with check (inspection_id in (select id from inspections where organization_id = my_organization_id()));
