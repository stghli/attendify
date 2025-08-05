-- Let's create a simple admin user using proper Supabase auth flow
-- First, we'll create a function to safely add an admin user

CREATE OR REPLACE FUNCTION create_admin_user(user_email text, user_password text, user_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  result json;
BEGIN
  -- This function should be called from the application, not directly
  -- But we'll create it for reference
  
  -- Note: Direct insertion into auth.users is not recommended
  -- Users should be created through Supabase Auth API
  
  RETURN json_build_object(
    'message', 'User should be created through Supabase Dashboard or Auth API',
    'email', user_email
  );
END;
$$;