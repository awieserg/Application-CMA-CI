-- Désactiver RLS pour mettre à jour les politiques
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Allow anonymous signup" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Allow read access to all authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "No one can read password_hash" ON user_profiles;
DROP POLICY IF EXISTS "Restrict password updates" ON user_profiles;

-- Réactiver RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Créer les nouvelles politiques RLS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Allow super admins to manage all profiles'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Allow super admins to manage all profiles"
      ON user_profiles
      FOR ALL 
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles up
          WHERE up.user_id = auth.uid()
          AND (up.role = 'president' OR up.role = 'secretary_general')
        )
      )
    $policy$;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can read own profile'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users can read own profile"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id)
    $policy$;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Users can update own profile"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)
    $policy$;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'No one can read password_hash'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "No one can read password_hash"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (false)
    $policy$;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Restrict password updates'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Restrict password updates"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id)
    $policy$;
  END IF;
END $$;

-- Mettre à jour la fonction de gestion des nouveaux utilisateurs
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Mettre à jour user_profiles avec l'ID utilisateur
  UPDATE user_profiles
  SET user_id = NEW.id
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger
DROP TRIGGER IF EXISTS on_user_profile_created ON user_profiles;

CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();