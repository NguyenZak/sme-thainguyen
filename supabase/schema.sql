-- ==========================================
-- SME VIETNAM 2026 - CMS DATABASE SCHEMA
-- ==========================================

-- 1. Site Sections (Dynamic JSON Content Store)
CREATE TABLE IF NOT EXISTS public.site_sections (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Timeline / Agenda Events Table
CREATE TABLE IF NOT EXISTS public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INT NOT NULL, -- 1, 2, or 3
  day_title TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  title TEXT NOT NULL,
  speaker TEXT,
  location TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Sponsors Table
CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('diamond', 'gold', 'silver', 'bronze', 'co-organizer', 'companion')),
  logo_url TEXT NOT NULL,
  website_url TEXT,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Exhibition Booths Table
CREATE TABLE IF NOT EXISTS public.booths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booth_code TEXT NOT NULL UNIQUE,
  area_name TEXT NOT NULL, -- e.g., 'Khu Vực A - Công Nghệ'
  size TEXT NOT NULL DEFAULT '3m x 3m',
  price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  reserved_by TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Customer Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  ticket_type TEXT NOT NULL DEFAULT 'standard',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 1. site_sections: Public Read, Auth Write
CREATE POLICY "Public site_sections read" ON public.site_sections FOR SELECT USING (true);
CREATE POLICY "Auth site_sections write" ON public.site_sections FOR ALL USING (auth.role() = 'authenticated');

-- 2. timeline_events: Public Read, Auth Write
CREATE POLICY "Public timeline_events read" ON public.timeline_events FOR SELECT USING (true);
CREATE POLICY "Auth timeline_events write" ON public.timeline_events FOR ALL USING (auth.role() = 'authenticated');

-- 3. sponsors: Public Read, Auth Write
CREATE POLICY "Public sponsors read" ON public.sponsors FOR SELECT USING (true);
CREATE POLICY "Auth sponsors write" ON public.sponsors FOR ALL USING (auth.role() = 'authenticated');

-- 4. booths: Public Read, Auth Write
CREATE POLICY "Public booths read" ON public.booths FOR SELECT USING (true);
CREATE POLICY "Auth booths write" ON public.booths FOR ALL USING (auth.role() = 'authenticated');

-- 5. registrations: Public Insert, Auth Read/Write
CREATE POLICY "Public registrations insert" ON public.registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth registrations read" ON public.registrations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth registrations write" ON public.registrations FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- STORAGE BUCKET FOR MEDIA UPLOADS
-- ==========================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cms-media', 'cms-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'cms-media');
CREATE POLICY "Auth Insert Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms-media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'cms-media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'cms-media' AND auth.role() = 'authenticated');
