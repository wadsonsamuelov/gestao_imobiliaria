# Cadastre — sistema de administração de imóveis

Projeto completo: banco de dados (Supabase/Postgres), autenticação, e todas
as telas já ligadas a dados reais — Painel, Imóveis (lista + ficha com
abas), Inquilinos, Contratos, Boletos & Juros (com calculadora), Controle
de Gastos, Meus Ganhos, Vistorias, Entrega de Chaves, Prestadores de
Serviço e Histórico.

## Por que está organizado assim (para mudar a interface sem dor de cabeça)

- **`src/app/globals.css`** — todo o visual (cores, tipografia, tema
  claro/escuro, o "prego decorativo" dos cartões etc.) mora neste único
  arquivo. Trocar uma cor ou fonte aqui muda o sistema inteiro de uma vez.
- **`src/components/ui/`** — as peças reutilizáveis (`PlanCard`,
  `SectionTitle`, `Tag`, `StatCard`). Se um dia você quiser mudar como todo
  cartão se parece, mexe em um lugar só: `plan-card.tsx`.
- **`src/components/sidebar.tsx` e `topbar.tsx`** — o menu e o topo,
  compartilhados por todas as páginas via `src/app/(app)/layout.tsx`.
- **Cada seção é uma pasta isolada** em `src/app/(app)/`: `imoveis/`,
  `inquilinos/`, `financeiro/` etc. Mexer em uma não afeta as outras.
- **Toda escrita no banco passa por uma `actions.ts`** dentro da pasta da
  seção (ex: `src/app/(app)/ganhos/actions.ts`) — é o único lugar que fala
  com o Supabase para gravar dados. Se amanhã você trocar o provedor de
  banco, é nesses arquivos que mexe, não nas telas.

## Passo a passo — do zero até rodando

### 1. Criar o projeto no Supabase
[supabase.com](https://supabase.com) → New Project (plano gratuito serve
para começar).

### 2. Rodar as migrações
No painel do Supabase → **SQL Editor**, rode nesta ordem:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_seed.sql`
3. `supabase/migrations/0003_earnings.sql`
4. `supabase/migrations/0004_storage.sql` (cria o espaço de armazenamento das fotos de vistoria)

### 3. Criar os 2 usuários
**Authentication → Users → Add user** — um para você, um para a outra
pessoa. Depois, no SQL Editor, vincule os perfis à organização semeada
(troque pelos UUIDs reais que aparecem na lista de usuários):

```sql
update profiles set organization_id = '00000000-0000-0000-0000-000000000001',
  full_name = 'Bruce Wayne', role = 'admin'
  where id = 'UUID_DO_PRIMEIRO_USUARIO';

update profiles set organization_id = '00000000-0000-0000-0000-000000000001',
  full_name = 'NOME_DA_SEGUNDA_PESSOA', role = 'gestor'
  where id = 'UUID_DO_SEGUNDO_USUARIO';
```

### 4. Configurar variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha com os valores de
**Project Settings → API** no painel do Supabase.

### 5. Instalar e rodar
```bash
npm install
npm run dev
```
Acesse `http://localhost:3000`, faça login, e todas as telas devem
carregar com os dados semeados.

---

## Criando o repositório (Git + GitHub)

Isso guarda o histórico do seu código e te permite, por exemplo, voltar
atrás se uma mudança futura quebrar algo — e também é pré-requisito para
hospedar o site (passo seguinte).

### 1. Criar conta e repositório no GitHub
Se ainda não tem: crie uma conta em [github.com](https://github.com).
Depois clique em **New repository** (botão verde), dê um nome (ex:
`gestao_imobiliaria`), deixe como **Private** (o código fica só seu), e **não**
marque nenhuma opção de inicializar com README — o projeto já tem um.

### 2. O `.gitignore` já vem pronto
`node_modules`, `.next` e `.env.local` (a chave do Supabase) ficam de fora
do repositório — segredos nunca vão para o Git.

### 3. Subir o código
Dentro da pasta do projeto, no terminal:

```bash
git init
git add .
git commit -m "Primeira versão do Cadastre"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gestao_imobiliaria.git
git push -u origin main
```

(O GitHub mostra esse exato bloco de comandos, já com a URL certa, na
página do repositório recém-criado — pode copiar de lá também.)

### 4. Dali para frente
Toda vez que mudar algo:
```bash
git add .
git commit -m "descreva o que mudou"
git push
```

### 5. Hospedar (opcional, para acessar de qualquer lugar)
Como o projeto é Next.js, o caminho mais simples é a
[Vercel](https://vercel.com) (dos mesmos criadores do Next.js, tem plano
gratuito): conecte sua conta GitHub, importe o repositório `gestao_imobiliaria`,
cole as mesmas variáveis do `.env.local` na tela de configuração, e o
deploy passa a ser automático a cada `git push`.

---

## O que já está ligado ao banco de verdade

| Seção | Lista | Criar | Editar | Excluir | Observação |
|---|---|---|---|---|---|
| Painel | ✅ | — | — | — | Números calculados ao vivo |
| Imóveis | ✅ | ✅ | ✅ | ✅ | Ficha, contrato e vistoria editáveis dentro do próprio imóvel |
| Inquilinos | ✅ | ✅ | ✅ | ✅ | Exclusão bloqueada se houver contrato vinculado (integridade do banco) |
| Contratos | ✅ | ✅ | ✅ | — | Criação e edição ficam na ficha do imóvel; "excluir" é "encerrar contrato" |
| Boletos & Juros | ✅ | ✅ | ✅ | ✅ | "Marcar como pago" continua disponível; calculadora é só cálculo local |
| Controle de Gastos | ✅ | ✅ | ✅ | ✅ | |
| Meus Ganhos | ✅ | ✅ | — | ✅ | Marcar recebido/pendente e excluir |
| Vistorias | ✅ | ✅ | — | ✅ | **Upload de fotos de verdade** (Supabase Storage), dentro da ficha do imóvel |
| Entrega de Chaves | ✅ | ✅ | — | ✅ | |
| Prestadores | ✅ | ✅ | ✅ | ✅ | |
| Histórico | ✅ | — | — | — | Alimentado automaticamente conforme os eventos acontecerem |

### Sobre exclusões bloqueadas
Algumas exclusões podem falhar silenciosamente por design — é o banco protegendo a
integridade dos dados. Por exemplo: não dá para excluir um inquilino que tem
contrato ativo, nem um imóvel referenciado por um contrato antigo, sem antes
remover essas referências. Isso é intencional (evita perder histórico
financeiro/jurídico por engano), mas se quiser que o sistema avise com uma
mensagem clara em vez de simplesmente não excluir, é um ajuste pontual em cada
`actions.ts`.

## Próximos passos sugeridos
1. Checklist de itens por vistoria (hoje só fotos + observações gerais).
2. Geração de PDF do contrato preenchido.
3. Mensagens de erro visíveis quando uma exclusão é bloqueada pelo banco (ver
   nota acima).
4. Antes de qualquer lançamento público: revisão jurídica do contrato e
   política de privacidade (LGPD).
