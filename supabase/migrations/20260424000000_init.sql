-- RoyalRoot Interiors Supabase Schema

CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  dimensions text NOT NULL,
  images text[] DEFAULT '{}'::text[],
  is_available boolean DEFAULT true
);

-- Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.products FOR SELECT
  USING ( true );

-- Admin can insert/update/delete (Must be authenticated)
CREATE POLICY "Enable insert for authenticated users only"
  ON public.products FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Enable update for authenticated users only"
  ON public.products FOR UPDATE
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Enable delete for authenticated users only"
  ON public.products FOR DELETE
  USING ( auth.role() = 'authenticated' );

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('furniture-images', 'furniture-images', true);

CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'furniture-images' );

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'furniture-images' AND auth.role() = 'authenticated' );
