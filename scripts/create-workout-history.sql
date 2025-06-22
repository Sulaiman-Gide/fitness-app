-- Create workout_history table
CREATE TABLE IF NOT EXISTS public.workout_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    workout_template_id BIGINT REFERENCES public.workout_templates(id) ON DELETE SET NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    calories_burned INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.workout_history ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own workout history
CREATE POLICY "Users can view their own workout history" ON public.workout_history
    FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own workout history
CREATE POLICY "Users can insert their own workout history" ON public.workout_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own workout history
CREATE POLICY "Users can update their own workout history" ON public.workout_history
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own workout history
CREATE POLICY "Users can delete their own workout history" ON public.workout_history
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workout_history_user_id ON public.workout_history(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_history_completed_at ON public.workout_history(completed_at);
CREATE INDEX IF NOT EXISTS idx_workout_history_workout_template_id ON public.workout_history(workout_template_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workout_history_updated_at 
    BEFORE UPDATE ON public.workout_history 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for clarity
COMMENT ON TABLE public.workout_history IS 'Stores a record of each workout session completed by a user.';
COMMENT ON COLUMN public.workout_history.user_id IS 'Foreign key to the user who completed the workout.';
COMMENT ON COLUMN public.workout_history.workout_template_id IS 'Foreign key to the workout template that was completed.';
COMMENT ON COLUMN public.workout_history.completed_at IS 'The timestamp when the workout was marked as complete.';
COMMENT ON COLUMN public.workout_history.duration_seconds IS 'The total duration of the workout session in seconds.';
COMMENT ON COLUMN public.workout_history.calories_burned IS 'The total calories burned during the workout session.';
COMMENT ON COLUMN public.workout_history.created_at IS 'The timestamp when the workout history record was created.';
COMMENT ON COLUMN public.workout_history.updated_at IS 'The timestamp when the workout history record was last updated.'; 