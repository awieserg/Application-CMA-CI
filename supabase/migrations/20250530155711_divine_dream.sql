-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create departements table first since it's referenced by user_profiles
CREATE TABLE public.departements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  directeur TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_profiles table after departements exists
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'visitor',
  full_name TEXT NOT NULL,
  paroisse_id UUID REFERENCES public.paroisses(id) ON DELETE SET NULL,
  district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
  region_id UUID REFERENCES public.regions(id) ON DELETE SET NULL,
  departement_id UUID REFERENCES public.departements(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_role_assignment CHECK (
    (role = 'president') OR
    (role = 'secretary_general') OR
    (role = 'director' AND departement_id IS NOT NULL) OR
    (role = 'region_superintendent' AND region_id IS NOT NULL) OR
    (role = 'district_superintendent' AND district_id IS NOT NULL) OR
    (role = 'parish_intendant' AND paroisse_id IS NOT NULL)
  )
);

-- Add RLS policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Allow read access to all authenticated users"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow super admins to manage all profiles"
  ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.user_id = auth.uid()
      AND (up.role = 'president' OR up.role = 'secretary_general')
    )
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departements_updated_at
  BEFORE UPDATE ON public.departements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial departments
INSERT INTO public.departements (nom, code) VALUES
  ('Ressources Humaines', 'DEP-RH'),
  ('Financier', 'DEP-FIN'),
  ('Enseignement & Formation', 'DEP-ENS'),
  ('Développement & Patrimoine', 'DEP-DEV'),
  ('Mouvements & Associations', 'DEP-MVT'),
  ('Cultes, Arts & Culture', 'DEP-CAC'),
  ('Évangélisation & Mission', 'DEP-EVM'),
  ('Prière', 'DEP-PRI');