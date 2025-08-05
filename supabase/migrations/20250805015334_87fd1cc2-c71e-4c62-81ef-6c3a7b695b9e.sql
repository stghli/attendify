-- Create super admin user
-- Note: This creates a user directly in auth.users table with the specified credentials
-- The password will be hashed automatically by Supabase

-- Insert user into auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'achabedwardmccarthy@gmail.com',
  crypt('*1234Qwerty*2025#', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  ''
);

-- Create profile for the super admin user
INSERT INTO public.profiles (
  user_id,
  name,
  email,
  role
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'achabedwardmccarthy@gmail.com'),
  'Super Admin',
  'achabedwardmccarthy@gmail.com',
  'admin'
);