-- Run this once against your Neon database to set up the schema.
-- psql "$DATABASE_URL" -f db/schema.sql

create extension if not exists pgcrypto;

create table if not exists item_types (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create type condition as enum ('unused', 'like_new', 'fair');
create type item_status as enum ('pending', 'approved', 'sold');

create table if not exists items (
  id            uuid primary key default gen_random_uuid(),
  item_type_id  uuid not null references item_types(id),
  size          text not null,
  price         numeric(10, 2),
  seller_name   text not null,
  seller_phone  text not null,
  condition     condition not null,
  status        item_status not null default 'pending',
  created_at    timestamptz not null default now(),
  approved_at   timestamptz,
  sold_at       timestamptz
);

create index if not exists items_status_idx on items(status);
create index if not exists items_seller_phone_idx on items(seller_phone);
create index if not exists items_type_size_idx on items(item_type_id, size);

-- Seed a starting list of item types — edit/add more any time via the admin dashboard or directly here.
insert into item_types (name) values
  ('Golf Shirt'),
  ('Jersey'),
  ('Blazer'),
  ('Tracksuit Pants'),
  ('Skort'),
  ('Dress'),
  ('Shoes')
on conflict (name) do nothing;
