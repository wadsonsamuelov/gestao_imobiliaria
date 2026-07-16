-- ============================================================================
-- GANHOS PESSOAIS — controle de ganho de cada usuário (não é despesa do
-- imóvel, é o que a pessoa que administra recebeu: taxa de administração,
-- comissão etc). Por isso é vinculado a profile_id, não só a organization_id.
-- ============================================================================

create type earning_status as enum ('recebido', 'pendente');

create table earnings (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  profile_id        uuid not null references profiles(id) on delete cascade,
  description       text not null,
  value             numeric(12,2) not null,
  event_date        date not null default current_date,
  status             earning_status not null default 'pendente',
  property_id       uuid references properties(id) on delete set null,
  created_at        timestamptz not null default now()
);

create index on earnings (organization_id);
create index on earnings (profile_id);

alter table earnings enable row level security;

-- cada pessoa só vê (e mexe n)os próprios ganhos — mesmo dentro da mesma organização
create policy "cada usuário vê só os próprios ganhos" on earnings
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());
