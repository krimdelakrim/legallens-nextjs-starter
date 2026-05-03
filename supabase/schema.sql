-- LegalLens Bankruptcy Research App - Supabase schema MVP
-- Run this in Supabase SQL Editor.

create extension if not exists "uuid-ossp";

create table if not exists public.cases (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id text not null,
  debtor_name text,
  case_name text,
  case_number text,
  chapter text,
  jurisdiction_id text default 'JUR-BK-SDWV',
  court text,
  judge text,
  division text,
  status text default 'Open',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, case_id)
);

create table if not exists public.pleadings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_uuid uuid not null references public.cases(id) on delete cascade,
  pleading_id text not null,
  pleading_type text,
  issue_type text,
  filing_party text,
  filed_date date,
  requested_relief text,
  cited_authority text,
  cited_cases text,
  source_file_path text,
  ocr_text text,
  status text default 'Open',
  created_at timestamptz default now(),
  unique(user_id, pleading_id)
);

create table if not exists public.auto_intake_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pleading_uuid uuid references public.pleadings(id) on delete cascade,
  field text not null,
  extracted_value text,
  approved_value text,
  confidence text,
  approved boolean default false,
  source_reason text,
  created_at timestamptz default now()
);

create table if not exists public.significant_lines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_uuid uuid references public.cases(id) on delete cascade,
  pleading_uuid uuid references public.pleadings(id) on delete cascade,
  line_text text not null,
  issue_type text,
  element text,
  authority text,
  confidence text,
  approved boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.application_analysis (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_uuid uuid references public.cases(id) on delete cascade,
  pleading_uuid uuid references public.pleadings(id) on delete cascade,
  issue_type text,
  element text,
  opponent_claim text,
  our_facts text,
  precedent_match text default 'Unknown',
  best_supporting_case text,
  best_opposing_case text,
  application_analysis text,
  confidence text default 'Medium',
  next_research_task text,
  created_at timestamptz default now()
);

create table if not exists public.precedents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  jurisdiction_id text default 'JUR-BK-SDWV',
  circuit text,
  court text,
  case_name text not null,
  bluebook_citation text not null,
  year text,
  issue_type text,
  legal_standard text,
  key_quote text,
  holding text,
  fact_pattern text,
  outcome text,
  binding_weight text,
  pro_con text,
  applicability_notes text,
  shepardize_status text default 'Unverified',
  created_at timestamptz default now()
);

create table if not exists public.deadline_tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_uuid uuid references public.cases(id) on delete cascade,
  pleading_uuid uuid references public.pleadings(id) on delete cascade,
  task text not null,
  authority text,
  due_date date,
  status text default 'Open',
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.argument_drafts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_uuid uuid references public.cases(id) on delete cascade,
  issue_type text,
  position text,
  rule_statement text,
  fact_application text,
  conclusion text,
  authorities_used text,
  draft_status text default 'Draft',
  created_at timestamptz default now()
);

create table if not exists public.research_memos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_uuid uuid references public.cases(id) on delete cascade,
  memo_text text not null,
  created_at timestamptz default now()
);

create table if not exists public.filing_drafts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_uuid uuid references public.cases(id) on delete cascade,
  draft_text text not null,
  created_at timestamptz default now()
);

alter table public.cases enable row level security;
alter table public.pleadings enable row level security;
alter table public.auto_intake_reviews enable row level security;
alter table public.significant_lines enable row level security;
alter table public.application_analysis enable row level security;
alter table public.precedents enable row level security;
alter table public.deadline_tasks enable row level security;
alter table public.argument_drafts enable row level security;
alter table public.research_memos enable row level security;
alter table public.filing_drafts enable row level security;

create policy "Users can manage their own cases" on public.cases for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own pleadings" on public.pleadings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own intake reviews" on public.auto_intake_reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own significant lines" on public.significant_lines for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own application analysis" on public.application_analysis for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own precedents" on public.precedents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own deadline tasks" on public.deadline_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own argument drafts" on public.argument_drafts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own research memos" on public.research_memos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage their own filing drafts" on public.filing_drafts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('pleadings', 'pleadings', false)
on conflict (id) do nothing;

create policy "Users can upload their own pleading files"
on storage.objects for insert
with check (bucket_id = 'pleadings' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read their own pleading files"
on storage.objects for select
using (bucket_id = 'pleadings' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their own pleading files"
on storage.objects for delete
using (bucket_id = 'pleadings' and auth.uid()::text = (storage.foldername(name))[1]);
