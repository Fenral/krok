-- Krok initial schema
create extension if not exists postgis;

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table species (
  id uuid primary key default gen_random_uuid(),
  no_navn text not null,
  latin text not null,
  type text not null check (type in ('saltvann', 'ferskvann')),
  min_legal_size_cm integer,
  sesong_start date,
  sesong_slutt date
);

create table catches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  species_id uuid not null references species(id),
  weight_kg numeric(6,3),
  length_cm numeric(5,1),
  location geography(point, 4326) not null,
  water_body_name text,
  weather_jsonb jsonb,
  released boolean not null default false,
  notes text,
  caught_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index catches_user_caught_idx on catches (user_id, caught_at desc);
create index catches_location_gix on catches using gist (location);

create table catch_photos (
  id uuid primary key default gen_random_uuid(),
  catch_id uuid not null references catches(id) on delete cascade,
  storage_path text not null,
  ordering integer not null default 0
);

alter table profiles enable row level security;
alter table catches enable row level security;
alter table catch_photos enable row level security;
alter table species enable row level security;

create policy "profiles: read own" on profiles for select using (auth.uid() = id);
create policy "profiles: insert own" on profiles for insert with check (auth.uid() = id);
create policy "profiles: update own" on profiles for update using (auth.uid() = id);

create policy "catches: CRUD own" on catches for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "catch_photos: CRUD via own catch" on catch_photos for all
  using (exists (select 1 from catches c where c.id = catch_id and c.user_id = auth.uid()))
  with check (exists (select 1 from catches c where c.id = catch_id and c.user_id = auth.uid()));

create policy "species: public read" on species for select using (true);
