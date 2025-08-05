-- Clean up the incorrectly inserted user from auth.users
DELETE FROM auth.users WHERE email = 'achabedwardmccarthy@gmail.com';

-- Also clean up the profile entry
DELETE FROM public.profiles WHERE email = 'achabedwardmccarthy@gmail.com';

-- Create the user properly using Supabase's auth system
-- Note: We cannot directly insert into auth.users, so we'll create the profile entry
-- and the user will need to be created through the Supabase dashboard or auth API

-- For now, let's ensure the profiles table is ready for when the user is created properly
-- The user should be created through Supabase Dashboard -> Authentication -> Users