-- ============================================================================
-- STORAGE — bucket para fotos de vistoria
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('inspection-photos', 'inspection-photos', true)
on conflict (id) do nothing;

create policy "usuários autenticados podem enviar fotos de vistoria"
on storage.objects for insert to authenticated
with check (bucket_id = 'inspection-photos');

create policy "usuários autenticados podem ver fotos de vistoria"
on storage.objects for select to authenticated
using (bucket_id = 'inspection-photos');

create policy "usuários autenticados podem excluir fotos de vistoria"
on storage.objects for delete to authenticated
using (bucket_id = 'inspection-photos');
