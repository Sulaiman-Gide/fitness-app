-- Add a new column 'push_token' to the 'profiles' table to store push notification tokens.
ALTER TABLE public.profiles
ADD COLUMN push_token TEXT;

-- Add an index on the 'push_token' column for faster queries.
CREATE INDEX idx_profiles_push_token ON public.profiles(push_token);

-- Add a policy to ensure users can only update their own push_token.
CREATE POLICY "Users can update their own push_token"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Grant update permissions on the new column to authenticated users.
GRANT UPDATE (push_token) ON TABLE public.profiles TO authenticated; 