-- RoyalRoot Interiors Supabase Schema

-- Profiles Table (For RBAC and User Details)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  full_name text,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'customer' NOT NULL, -- customer, admin
  phone text,
  address text,
  city text,
  country text
);

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING ( true );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own profiles." ON public.profiles FOR UPDATE USING ( auth.uid() = id );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update any profile." ON public.profiles FOR UPDATE USING ( public.check_is_admin() );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
DO $$ BEGIN
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  dimensions text NOT NULL,
  images text[] DEFAULT '{}'::text[],
  is_available boolean DEFAULT true,
  stock_quantity integer DEFAULT 1 NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DO $$ BEGIN
  CREATE POLICY "Public profiles are viewable by everyone." ON public.products FOR SELECT USING ( true );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Admin can insert/update/delete (Must be authenticated)
DO $$ BEGIN
  CREATE POLICY "Enable all for admins" ON public.products FOR ALL USING ( public.check_is_admin() );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending' NOT NULL, -- pending, processing, shipped, delivered, cancelled
  shipping_address jsonb NOT NULL,
  contact_email text NOT NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL
);

-- Row Level Security (RLS) for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.check_is_admin());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING ( public.check_is_admin() );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Row Level Security (RLS) for Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND (user_id = auth.uid() OR public.check_is_admin()))
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert order items" ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed Data: Premium Heritage Collection
INSERT INTO public.products (name, description, price, category, dimensions, images, stock_quantity)
VALUES 
('Lumina Lounge Chair', 'A masterpiece of mid-century design, featuring hand-stitched leather and solid walnut frame.', 3200, 'Living Room', '85 x 80 x 100 cm', ARRAY['https://images.unsplash.com/photo-1592078615290-033ee584e267'], 5),
('Ethereal Dining Table', 'Sculptural dining table crafted from a single slab of reclaimed oak with blackened steel legs.', 5800, 'Dining Room', '240 x 100 x 75 cm', ARRAY['https://images.unsplash.com/photo-1577145946459-39a500671850'], 2),
('Obsidian Nightstand', 'Minimalist bedside companion featuring velvet-lined drawers and a honed marble top.', 1200, 'Bedroom', '50 x 45 x 60 cm', ARRAY['https://images.unsplash.com/photo-1532323544230-7191fd51bc1b'], 10),
('Aurelian Silk Bed', 'Grand bed frame upholstered in rare Italian silk with hand-carved mahogany headboard.', 8500, 'Bedroom', '210 x 220 x 140 cm', ARRAY['https://images.unsplash.com/photo-1505693419148-41280b3459ad'], 3),
('Celestial Pendant', 'Architectural lighting fixture composed of hand-blown glass and brushed brass.', 1800, 'Lighting', '60 x 60 x 80 cm', ARRAY['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15'], 8),
('Monolith Office Desk', 'Executive workspace carved from basalt stone and fitted with custom leather inlays.', 7200, 'Office', '200 x 90 x 76 cm', ARRAY['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd'], 4),
('Velvet Sovereign Sofa', 'Deep-seated sofa upholstered in rich forest green velvet with brass-capped legs.', 4500, 'Living Room', '240 x 110 x 85 cm', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc'], 6),
('Alabaster Sideboard', 'Refined storage solution featuring fluted marble doors and internal oak cabinetry.', 4200, 'Dining Room', '180 x 45 x 85 cm', ARRAY['https://images.unsplash.com/photo-1595428774223-ef52624120d2'], 3),
('Prism Bookshelf', 'Geometric shelving unit constructed from smoked glass and polished chrome.', 2900, 'Office', '120 x 35 x 200 cm', ARRAY['https://images.unsplash.com/photo-1594620302200-9a762244a156'], 7),
('Ivory Cloud Armchair', 'Bouclé upholstered armchair designed for ultimate comfort and sculptural presence.', 2600, 'Living Room', '90 x 95 x 80 cm', ARRAY['https://images.unsplash.com/photo-1567016432779-094069958ea5'], 9),
('Onyx Coffee Table', 'Low-profile coffee table featuring a nested design in polished black onyx.', 3400, 'Living Room', '110 x 110 x 35 cm', ARRAY['https://images.unsplash.com/photo-1533090161767-e6ffed986c88'], 5),
('Heritage Vanity', 'Art Deco inspired dressing table with tri-fold mirror and gold leaf accents.', 3900, 'Bedroom', '120 x 50 x 145 cm', ARRAY['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace'], 2),
('Monolith Sofa', 'A singular, architectural statement sofa upholstered in boucle wool.', 8900, 'Living Room', '280 x 110 x 75 cm', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc'], 3),
('Kyoto Sideboard', 'Minimalist oak storage inspired by traditional Japanese joinery.', 4500, 'Dining Room', '200 x 45 x 85 cm', ARRAY['https://images.unsplash.com/photo-1595428774223-ef52624120d2'], 4),
('Aether Chandelier', 'Suspended glass shards lit by hidden LEDs for a celestial glow.', 12500, 'Lighting', '120 cm Diameter', ARRAY['https://images.unsplash.com/photo-1542312167-7315c244986b'], 1),
('Bespoke Library Chair', 'Deep-seated leather chair with hand-carved mahogany legs.', 3200, 'Office', '85 x 90 x 110 cm', ARRAY['https://images.unsplash.com/photo-1592078615290-033ee584e267'], 6),
('Eclipse Floor Lamp', 'Rotating brass discs that manipulate light and shadow.', 2800, 'Lighting', '40 x 40 x 165 cm', ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c'], 8),
('Summit Dining Table', 'Raw-edge monolith of white Carrara marble seating twelve.', 22000, 'Dining Room', '320 x 120 x 76 cm', ARRAY['https://images.unsplash.com/photo-1577140917170-285929fb55b7'], 1),
('Solis Bedside Table', 'Floating walnut drawer with a recessed limestone top.', 1800, 'Bedroom', '55 x 45 x 50 cm', ARRAY['https://images.unsplash.com/photo-1532323544230-7191fd51bc1b'], 10),
('Velvet Muse Daybed', 'Sculptural lounge piece in sage silk velvet.', 5600, 'Living Room', '190 x 85 x 45 cm', ARRAY['https://images.unsplash.com/photo-1567016432779-094069958ad5'], 2),
('Aura Pendant', 'Hand-blown smoked glass globe with an internal gold filament.', 1500, 'Lighting', '45 cm Diameter', ARRAY['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15'], 12),
('Artisan Writing Desk', 'Integrated leather writing surface with concealed cable management.', 7800, 'Office', '160 x 75 x 76 cm', ARRAY['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd'], 3),
('Bordeaux Dining Chair', 'Set of 6 high-back chairs in oxblood leather.', 9000, 'Dining Room', '50 x 55 x 110 cm', ARRAY['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c'], 2),
('Luna Sconce', 'Indirect light piece that mimics the phases of the moon.', 1200, 'Lighting', '30 x 30 x 10 cm', ARRAY['https://images.unsplash.com/photo-1534073828943-f801091bb18c'], 15),
('Horizon Credenza', 'Gilded metal doors with a wave-pattern relief.', 11500, 'Living Room', '220 x 50 x 80 cm', ARRAY['https://images.unsplash.com/photo-1505693314120-0d443867891c'], 2),
('Nebula Rug', 'Hand-knotted silk rug with a deep indigo atmospheric gradient.', 14000, 'Living Room', '300 x 400 cm', ARRAY['https://images.unsplash.com/photo-1575414003591-ece8d0416c7a'], 1),
('Symmetry Bookshelf', 'Brushed steel frame with cantilevered glass shelving.', 6500, 'Office', '120 x 40 x 220 cm', ARRAY['https://images.unsplash.com/photo-1594620302200-9a762244a156'], 4),
('Vera Armchair', 'Curvaceous organic form in textured cream bouclé.', 4200, 'Living Room', '95 x 90 x 80 cm', ARRAY['https://images.unsplash.com/photo-1598191383441-73bb1604a82a'], 5),
('Empire Chandelier', 'A modern take on the ballroom classic with 48 points of light.', 18500, 'Lighting', '150 cm Diameter', ARRAY['https://images.unsplash.com/photo-1520699697851-3dc68aa3a474'], 1),
('Titan Desk', 'A massive block of cast concrete and tempered glass.', 9800, 'Office', '200 x 100 x 76 cm', ARRAY['https://images.unsplash.com/photo-1497215728101-856f4ea42174'], 2),
('Nocturne Nightstand', 'High-gloss ebony finish with mother-of-pearl inlays.', 2400, 'Bedroom', '65 x 50 x 60 cm', ARRAY['https://images.unsplash.com/photo-1531430845175-8585e7a58ad3'], 6),
('Solaris Dining Table', 'Circular bronze base with a smoked eucalyptus top.', 15000, 'Dining Room', '180 cm Diameter', ARRAY['https://images.unsplash.com/photo-1530018607912-eff2df114fbe'], 2),
('Gilded Mirror', 'Floor-length mirror with a hand-carved baroque frame.', 5200, 'Decor', '110 x 240 cm', ARRAY['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6'], 3),
('Zen Garden Bench', 'Polished basalt bench for indoor or conservatory use.', 4800, 'Outdoor', '160 x 45 x 45 cm', ARRAY['https://images.unsplash.com/photo-1511993226957-cd166aba52d8'], 4),
('Aurora Floor Lamp', 'Dichroic glass panels that shift color with the viewing angle.', 3600, 'Lighting', '35 x 35 x 180 cm', ARRAY['https://images.unsplash.com/photo-1540932239986-30128078f3c5'], 5),
('Velvet Sovereign Headboard', 'Floor-to-ceiling upholstered panels in royal navy.', 7500, 'Bedroom', 'Custom Height x 220 cm', ARRAY['https://images.unsplash.com/photo-1505693413171-293669746a57'], 2),
('Mesa Coffee Table', 'Constructed from a single weathered redwood burl.', 12000, 'Living Room', '140 x 110 x 30 cm', ARRAY['https://images.unsplash.com/photo-1581428982868-e410dd047a90'], 1),
('Apex Office Chair', 'Fully ergonomic masterpiece in polished aluminum and mesh.', 2800, 'Office', '70 x 70 x 120 cm', ARRAY['https://images.unsplash.com/photo-1580480055273-228ff5388ef8'], 12),
('Opaline Buffet', 'Translucent glass doors lit from within.', 8500, 'Dining Room', '180 x 50 x 90 cm', ARRAY['https://images.unsplash.com/photo-1595515106969-1ce29566ff1c'], 3),
('Vortex Sculpture', 'Abstract bronze sculpture by local artisan.', 9500, 'Decor', '60 x 60 x 180 cm', ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e5a38'], 1)
ON CONFLICT DO NOTHING;

-- Automation: Reduce stock_quantity on purchase
CREATE OR REPLACE FUNCTION public.reduce_stock_on_order()
RETURNS trigger AS $$
BEGIN
  -- Check if enough stock exists
  IF NOT EXISTS (
    SELECT 1 FROM public.products 
    WHERE id = new.product_id AND stock_quantity >= new.quantity
  ) THEN
    RAISE EXCEPTION 'Insufficient stock for product %', new.product_id;
  END IF;

  -- Reduce stock
  UPDATE public.products
  SET stock_quantity = stock_quantity - new.quantity
  WHERE id = new.product_id;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_item_created
  BEFORE INSERT ON public.order_items
  FOR EACH ROW EXECUTE PROCEDURE public.reduce_stock_on_order();

-- Automation: Restore stock on cancellation
CREATE OR REPLACE FUNCTION public.restore_stock_on_cancellation()
RETURNS trigger AS $$
BEGIN
  IF (new.status = 'cancelled' AND old.status != 'cancelled') THEN
    UPDATE public.products p
    SET stock_quantity = p.stock_quantity + oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = new.id AND p.id = oi.product_id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_cancelled
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.restore_stock_on_cancellation();
