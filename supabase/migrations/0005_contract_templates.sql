-- ============================================================================
-- MODELOS DE CONTRATO — cada organização pode ter vários modelos,
-- editáveis, com um marcado como padrão. O texto usa placeholders
-- ({{campo}}) que são substituídos automaticamente na hora de gerar o PDF.
-- ============================================================================

create table contract_templates (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  name              text not null,
  body              text not null,
  is_default        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index on contract_templates (organization_id);

alter table contract_templates enable row level security;

create policy "acesso por organização" on contract_templates
  for all using (organization_id = my_organization_id()) with check (organization_id = my_organization_id());

-- cada contrato pode registrar qual modelo foi usado para gerá-lo
alter table contracts add column if not exists template_id uuid references contract_templates(id) on delete set null;

-- garante no máximo 1 modelo padrão por organização
create unique index contract_templates_one_default_per_org
  on contract_templates (organization_id) where (is_default);
