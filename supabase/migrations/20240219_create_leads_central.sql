-- Create leads_central table for P2P/Nexus Intel
create table if not exists public.leads_central (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  phone text not null,
  source text not null check (source in ('Shop', 'Seed')),
  peer_id text not null, -- The PeerJS ID for direct connection
  status text default 'pending' check (status in ('pending', 'connected', 'completed', 'archived')),
  email text, -- Optional email for notifications
  metadata jsonb -- Any extra info
);

-- Enable RLS
alter table public.leads_central enable row level security;

-- Policies (Adjust strictly for production)
-- Allow anyone to insert (public leads)
create policy "Enable insert for everyone" on public.leads_central for insert with check (true);

-- Allow admins to view all (assuming authenticated role or specific admin check)
create policy "Enable read for authenticated users" on public.leads_central for select using (auth.role() = 'authenticated');

-- Realtime
alter publication supabase_realtime add table public.leads_central;
