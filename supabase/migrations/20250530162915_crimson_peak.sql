-- Update user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;

-- Update the role validation constraint
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS valid_role_assignment;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT valid_role_assignment CHECK (
  (role = 'president') OR
  (role = 'secretary_general') OR
  (role = 'director' AND departement_id IS NOT NULL) OR
  (role = 'region_superintendent' AND region_id IS NOT NULL) OR
  (role = 'district_superintendent' AND district_id IS NOT NULL) OR
  (role = 'parish_intendant' AND paroisse_id IS NOT NULL) OR
  (role = 'community_pastor' AND paroisse_id IS NOT NULL) OR
  (role = 'assistant_pastor' AND paroisse_id IS NOT NULL) OR
  (role = 'missionary') OR
  (role = 'chaplain') OR
  (role = 'technical_assistant') OR
  (role = 'visitor')
);

-- Add RLS policies for user management
CREATE POLICY "Allow super admins to manage user activation"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.user_id = auth.uid()
      AND (up.role = 'president' OR up.role = 'secretary_general')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.user_id = auth.uid()
      AND (up.role = 'president' OR up.role = 'secretary_general')
    )
  );