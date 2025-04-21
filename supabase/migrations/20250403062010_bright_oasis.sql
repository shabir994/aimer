/*
  # Create emotions tracking tables

  1. New Tables
    - `emotions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text)
      - `data` (jsonb)
      - `created_at` (timestamp)
    - `suggestions`
      - `id` (uuid, primary key)
      - `emotion_id` (uuid, references emotions)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create emotions table
CREATE TABLE IF NOT EXISTS emotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  type text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emotion_id uuid REFERENCES emotions NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own emotions"
  ON emotions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own emotions"
  ON emotions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view suggestions for their emotions"
  ON suggestions
  FOR SELECT
  TO authenticated
  USING (
    emotion_id IN (
      SELECT id FROM emotions WHERE user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX emotions_user_id_idx ON emotions(user_id);
CREATE INDEX emotions_created_at_idx ON emotions(created_at);
CREATE INDEX suggestions_emotion_id_idx ON suggestions(emotion_id);