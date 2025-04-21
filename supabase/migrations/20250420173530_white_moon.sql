/*
  # Update profiles table RLS policies

  1. Changes
    - Safely drop and recreate RLS policies
    - Add policies for:
      - Viewing own profile
      - Updating own profile
      - Inserting own profile on registration
  
  2. Security
    - Ensures users can only access their own profile data
    - Allows profile creation during registration
    - Maintains data privacy and security
*/

DO $$
BEGIN
    -- Drop existing policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Enable read access for own profile'
    ) THEN
        DROP POLICY "Enable read access for own profile" ON profiles;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Enable insert for users creating their profile'
    ) THEN
        DROP POLICY "Enable insert for users creating their profile" ON profiles;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Enable update for users modifying their own profile'
    ) THEN
        DROP POLICY "Enable update for users modifying their own profile" ON profiles;
    END IF;
END $$;

-- Create comprehensive policies for profile management
CREATE POLICY "Enable read access for own profile"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id
);

CREATE POLICY "Enable insert for users creating their profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id
);

CREATE POLICY "Enable update for users modifying their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
);