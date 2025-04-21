/*
  # Update profiles table RLS policies

  1. Changes
    - Drop existing RLS policies on profiles table
    - Add new policies for:
      - Viewing own profile
      - Updating own profile
      - Inserting own profile on registration
  
  2. Security
    - Ensures users can only access their own profile data
    - Allows profile creation during registration
    - Maintains data privacy and security
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

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