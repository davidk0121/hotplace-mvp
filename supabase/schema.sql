-- HotPlace MVP — Supabase schema (설계 문서 / 참고용)
--
-- 지금 앱은 이 스키마에 연결되어 있지 않다. localStorage 기반 MVP로
-- 화면/흐름을 먼저 검증한 뒤, 이 SQL을 Supabase 프로젝트의 SQL Editor에서
-- 실행해 실제 DB로 전환한다 (자세한 절차는 README의 "Step 5" 참고).
--
-- 인증 설계 메모:
--   - 아직 Supabase Auth를 붙이지 않았으므로, 모든 테이블에 nullable한
--     user_id(auth.users 참조)와 anon_id(브라우저별 임시 식별자, 클라이언트에서
--     생성해 localStorage에 저장) 컬럼을 함께 둔다.
--   - 처음에는 anon_id로 "내 데이터"를 구분하고, 나중에 로그인 기능을 추가하면
--     기존 anon_id 데이터를 user_id로 이관(migrate)하는 방식으로 확장한다.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: auth.users를 보강하는 선택적 테이블 (Supabase Auth 도입 후 사용)
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- places: 사용자가 저장한 장소
-- ---------------------------------------------------------------------------
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  anon_id text,
  name text not null,
  region text not null default '',
  -- 카테고리는 언어 중립 키로 저장하고, 표시 라벨은 클라이언트의
  -- i18n 사전(src/i18n/locales/*)에서 번역한다.
  category text not null default 'other'
    check (category in ('food', 'cafe', 'date', 'family', 'travel', 'shopping', 'other')),
  memo text not null default '',
  original_input text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint places_owner_present check (user_id is not null or anon_id is not null)
);

create index if not exists places_user_id_idx on places (user_id);
create index if not exists places_anon_id_idx on places (anon_id);

-- ---------------------------------------------------------------------------
-- place_lists: "서울 데이트", "제주 여행" 같은 공유 가능한 리스트
-- ---------------------------------------------------------------------------
create table if not exists place_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  anon_id text,
  title text not null,
  description text not null default '',
  -- 목적 태그 (언어 중립 키, 라벨은 클라이언트 i18n에서 번역)
  tags text[] not null default '{}',
  -- 공유 링크에 쓰이는 짧은 랜덤 slug (예: /lists/share/ab12cd34)
  share_id text not null unique default encode(gen_random_bytes(6), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint place_lists_owner_present check (user_id is not null or anon_id is not null)
);

create index if not exists place_lists_user_id_idx on place_lists (user_id);
create index if not exists place_lists_anon_id_idx on place_lists (anon_id);

-- ---------------------------------------------------------------------------
-- list_places: 리스트 <-> 장소 다대다 관계 (join table)
-- ---------------------------------------------------------------------------
create table if not exists list_places (
  list_id uuid not null references place_lists (id) on delete cascade,
  place_id uuid not null references places (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (list_id, place_id)
);

-- ---------------------------------------------------------------------------
-- waitlist_emails: 랜딩페이지 이메일 수집
-- ---------------------------------------------------------------------------
create table if not exists waitlist_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- ai_plan_requests: AI 데이트/여행 코스 추천 요청 로그 (지금은 mock 응답 저장용)
-- ---------------------------------------------------------------------------
create table if not exists ai_plan_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  anon_id text,
  prompt text not null,
  -- OpenAI 연동 전까지는 mock 응답 텍스트를 그대로 저장한다.
  response text,
  created_at timestamptz not null default now()
);

create index if not exists ai_plan_requests_user_id_idx on ai_plan_requests (user_id);

-- ---------------------------------------------------------------------------
-- saved_plans: 생성된 코스(하루 일정)를 저장 (지금은 미저장, 구조만 예약)
--
-- 클라이언트의 GeneratedPlan 타입(src/lib/plan.ts)과 1:1 대응한다.
--   slots: [{ key: 'morning'|'lunch'|'afternoon'|'evening', placeIds: [...] }]
-- 지금은 mock 생성 후 화면에만 표시하고 저장하지 않는다. 나중에 "코스 저장"
-- 기능을 붙일 때 이 테이블에 insert 하도록 확장한다.
-- ---------------------------------------------------------------------------
create table if not exists saved_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade,
  anon_id text,
  -- 특정 리스트 기반이면 그 리스트 참조, 아니면 null (전체 저장 장소 기반)
  list_id uuid references place_lists (id) on delete set null,
  prompt text not null default '',
  slots jsonb not null default '[]',
  created_at timestamptz not null default now(),
  constraint saved_plans_owner_present check (user_id is not null or anon_id is not null)
);

create index if not exists saved_plans_user_id_idx on saved_plans (user_id);
create index if not exists saved_plans_anon_id_idx on saved_plans (anon_id);

-- ---------------------------------------------------------------------------
-- Row Level Security (Supabase Auth 연동 시점에 활성화)
--
-- MVP 단계(anon key + anon_id 방식)에서는 RLS를 끄거나, anon_id를
-- 클라이언트가 스스로 주장하는 값 그대로 신뢰해야 하므로 보안 수준이
-- 낮다는 점을 인지하고 사용한다. 실제 로그인 기능을 추가하면 아래처럼
-- auth.uid() 기반 정책으로 강화한다.
-- ---------------------------------------------------------------------------
-- alter table places enable row level security;
-- create policy "Users manage their own places"
--   on places for all
--   using (auth.uid() = user_id)
--   with check (auth.uid() = user_id);
--
-- alter table place_lists enable row level security;
-- create policy "Users manage their own lists"
--   on place_lists for all
--   using (auth.uid() = user_id)
--   with check (auth.uid() = user_id);
--
-- -- 공유 링크로 들어온 방문자는 share_id로 리스트를 "읽기"만 할 수 있어야 하므로
-- -- 별도의 SELECT 정책(anon 포함 전체 공개)을 둔다.
-- create policy "Anyone can read a list via its share_id"
--   on place_lists for select
--   using (true);
