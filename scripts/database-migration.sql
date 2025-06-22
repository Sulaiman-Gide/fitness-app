-- Database Migration: Add profile completion fields
-- Run this in your Supabase SQL editor

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  height INTEGER,
  weight INTEGER,
  age INTEGER,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS height INTEGER,
ADD COLUMN IF NOT EXISTS weight INTEGER,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add comments for documentation
COMMENT ON COLUMN profiles.height IS 'Height in centimeters';
COMMENT ON COLUMN profiles.weight IS 'Weight in kilograms';
COMMENT ON COLUMN profiles.age IS 'Age in years';
COMMENT ON COLUMN profiles.gender IS 'Gender (Male, Female, Other)';

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(id);

-- Optional: Add a check constraint for valid values
ALTER TABLE profiles 
ADD CONSTRAINT check_height_positive CHECK (height > 0),
ADD CONSTRAINT check_weight_positive CHECK (weight > 0),
ADD CONSTRAINT check_age_positive CHECK (age > 0 AND age < 150),
ADD CONSTRAINT check_gender_valid CHECK (gender IN ('male', 'female'));

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, created_at, updated_at)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email, now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 