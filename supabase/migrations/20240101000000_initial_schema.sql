-- US-FFT-014: Backend Foundation
-- This migration creates the initial database schema for user profiles and flow persistence

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create flows table for persisting user flow data
CREATE TABLE IF NOT EXISTS flows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT DEFAULT 'My Flow',
    nodes_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS flows_user_id_idx ON flows(user_id);

-- Enable RLS on flows
ALTER TABLE flows ENABLE ROW LEVEL SECURITY;

-- Flows policies: Users can only access their own flows
CREATE POLICY "Users can view own flows"
    ON flows FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flows"
    ON flows FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flows"
    ON flows FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flows"
    ON flows FOR DELETE
    USING (auth.uid() = user_id);

-- Create a function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_flows_updated_at BEFORE UPDATE ON flows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
