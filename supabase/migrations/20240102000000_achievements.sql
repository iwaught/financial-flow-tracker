-- US-FFT-015: Gamification Achievements
-- This migration creates tables for achievement tracking

-- Create achievements table (predefined achievements)
CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT '🏆',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert starter achievement set
INSERT INTO achievements (id, title, description, icon) VALUES
    ('first_income', 'First Step', 'Create your first income box', '💰'),
    ('triple_income', 'Triple Income', 'Reach 3 income sources', '🎯'),
    ('first_expense', 'Budget Builder', 'Create your first expense box', '💳'),
    ('balanced_map', 'Balanced Map', 'Reach at least 2 income and 2 expense boxes', '⚖️'),
    ('five_connections', 'Connector', 'Create 5 valid connections', '🔗'),
    ('first_save', 'Data Keeper', 'Save your flow for the first time', '💾')
ON CONFLICT (id) DO NOTHING;

-- Create user_achievements table for tracking unlocked achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS user_achievements_user_id_idx ON user_achievements(user_id);

-- Enable RLS on user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS policies: Users can only view and insert their own achievements
CREATE POLICY "Users can view own achievements"
    ON user_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
    ON user_achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Achievements table is public (read-only for all authenticated users)
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are viewable by everyone"
    ON achievements FOR SELECT
    TO authenticated
    USING (true);
