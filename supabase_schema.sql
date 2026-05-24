-- ============================================================
-- RIANNIE'S KITCHEN — Supabase Database Schema
-- ============================================================
-- HOW TO USE:
-- 1. Go to your Supabase project dashboard
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New query"
-- 4. Copy and paste ALL of this file
-- 5. Click the green "Run" button
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── CATEGORIES ─────────────────────────────────────────────
create table if not exists categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  slug       text not null unique,
  icon       text default '🍜',
  sort_order integer default 0,
  created_at timestamptz default now()
);

insert into categories (name, slug, icon, sort_order) values
  ('Stir Fry',         'stir',    '🥢', 1),
  ('Native Pack',      'native',  '🌶', 2),
  ('Protein Upgrades', 'upgrade', '🔥', 3),
  ('Extras',           'extra',   '➕', 4)
on conflict (slug) do nothing;

-- ── MENU ITEMS ─────────────────────────────────────────────
create table if not exists menu_items (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  description   text,
  price         integer not null default 0,
  category_slug text not null references categories(slug),
  badge         text default '',
  image_url     text default '',
  available     boolean default true,
  sort_order    integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

insert into menu_items (name, description, price, category_slug, badge, image_url, available, sort_order) values
  ('Rich Stir-Fry Noodles',      'Veggie, Sausage and Boiled/Fried Egg — the perfect everyday combo.',              2500, 'stir',    'Best Value', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', true, 1),
  ('Loaded Stir-Fry Spaghetti',  'Veggie, Sausage and Boiled/Fried Egg — rich flavours in every strand.',           3500, 'stir',    'Fan Fave',   'https://images.unsplash.com/photo-1551183053-bf91798d8d63?auto=format&fit=crop&w=600&q=80', true, 2),
  ('Rich Native Noodles',        'Rich palm oil & pepper mix, scent leaf, shredded fish, ponmo and boiled egg.',    3000, 'native',  '🌶 Spicy',   'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', true, 1),
  ('Loaded Native Spaghetti',    'Rich palm oil & pepper mix, scent leaf, shredded fish, ponmo and boiled egg.',    4000, 'native',  'Bestseller', 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80', true, 2),
  ('Peppered Turkey Midwing',    'Well peppered & seasoned turkey midwing — the ultimate protein upgrade.',          4000, 'upgrade', '🔥 Hot!',    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80', true, 1),
  ('Peppered Chicken',           'Well seasoned & tossed in hot chili sauce — crispy outside, juicy inside.',       2500, 'upgrade', 'Crispy',     'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=600&q=80', true, 2),
  ('Peppered Smoked Panla Fish', 'Perfectly smoked & peppered Panla fish — full of rich, deep Nigerian flavour.',  1000, 'upgrade', 'Smoky',      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true, 3),
  ('Extra Spag / Noodles',       'An extra serving of spaghetti or noodles.',                                        500,  'extra',   'Add-on',     'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', true, 1),
  ('Fried Plantain (Dodo)',      'Perfectly fried sweet plantain — crispy golden goodness.',                         500,  'extra',   'Sweet',      'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=600&q=80', true, 2),
  ('Egg (Fried or Boiled)',      'Choose your style — golden fried or soft boiled.',                                 400,  'extra',   'Protein',    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80', true, 3),
  ('Extra Sausage',              'Juicy, well-seasoned sausage.',                                                    400,  'extra',   'Tasty',      'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80', true, 4)
on conflict do nothing;

-- ── STORE CONFIG ───────────────────────────────────────────
create table if not exists store_config (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

insert into store_config (key, value) values
  ('whatsapp',           '2348084378019'),
  ('email',              'rianniekitchen@gmail.com'),
  ('location',           'LASU Ojo Campus, Lagos'),
  ('hours',              'Monday – Saturday, 12:00 PM – 7:00 PM'),
  ('store_open',         'true'),
  ('delivery_available', 'true')
on conflict (key) do nothing;

-- ── ORDERS ─────────────────────────────────────────────────
create table if not exists orders (
  id               uuid primary key default uuid_generate_v4(),
  customer_name    text not null,
  customer_phone   text not null,
  order_type       text not null default 'pickup',
  delivery_address text,
  notes            text,
  items            jsonb not null default '[]',
  total            integer not null default 0,
  status           text not null default 'pending',
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ── STORAGE BUCKET ─────────────────────────────────────────
-- After running this SQL, also do the following manually:
-- 1. Go to Storage in the left sidebar
-- 2. Click "New bucket"
-- 3. Name it: menu-images
-- 4. Toggle "Public bucket" ON
-- 5. Click Save

-- ── ROW LEVEL SECURITY (RLS) ───────────────────────────────
alter table menu_items   enable row level security;
alter table categories   enable row level security;
alter table store_config enable row level security;
alter table orders       enable row level security;

-- Public can READ menu + categories + config (for the storefront)
drop policy if exists "Public read menu_items"   on menu_items;
drop policy if exists "Public read categories"   on categories;
drop policy if exists "Public read store_config" on store_config;
drop policy if exists "Public insert orders"     on orders;

create policy "Public read menu_items"   on menu_items   for select using (true);
create policy "Public read categories"   on categories   for select using (true);
create policy "Public read store_config" on store_config for select using (true);
create policy "Public insert orders"     on orders       for insert with check (true);

-- Authenticated admin can do everything
drop policy if exists "Auth all menu_items"   on menu_items;
drop policy if exists "Auth all categories"   on categories;
drop policy if exists "Auth all store_config" on store_config;
drop policy if exists "Auth all orders"       on orders;

create policy "Auth all menu_items"   on menu_items   for all using (auth.role() = 'authenticated');
create policy "Auth all categories"   on categories   for all using (auth.role() = 'authenticated');
create policy "Auth all store_config" on store_config for all using (auth.role() = 'authenticated');
create policy "Auth all orders"       on orders       for all using (auth.role() = 'authenticated');

-- ── AUTO-UPDATE updated_at ─────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_menu_updated  on menu_items;
drop trigger if exists trg_order_updated on orders;

create trigger trg_menu_updated
  before update on menu_items
  for each row execute function update_updated_at();

create trigger trg_order_updated
  before update on orders
  for each row execute function update_updated_at();
