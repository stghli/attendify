-- Fix security vulnerability: Restrict attendance log creation to authenticated users only
-- Remove the overly permissive policy that allows anyone to insert attendance logs
DROP POLICY IF EXISTS "Anyone can insert attendance logs" ON public.attendance_logs;

-- Create a secure policy that only allows authenticated users to insert their own attendance records
CREATE POLICY "Authenticated users can insert their own attendance logs" 
ON public.attendance_logs 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Also add a policy for public QR scanner functionality (if needed for anonymous scanning)
-- This would require the QR scanner to work differently - users would need to be authenticated first
-- For now, we'll keep it strict and require authentication