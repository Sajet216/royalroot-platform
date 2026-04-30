-- Journal Table
CREATE TABLE public.journal (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  category text,
  image text,
  is_featured boolean DEFAULT false,
  published_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.journal ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public journals are viewable by everyone."
  ON public.journal FOR SELECT
  USING ( true );

-- Admin can insert/update/delete (Must be authenticated)
CREATE POLICY "Enable insert for authenticated users only"
  ON public.journal FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Enable update for authenticated users only"
  ON public.journal FOR UPDATE
  USING ( auth.role() = 'authenticated' );

CREATE POLICY "Enable delete for authenticated users only"
  ON public.journal FOR DELETE
  USING ( auth.role() = 'authenticated' );
