-- Fix security warnings by setting search_path on functions

-- Update generate_student_id function with proper search_path
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_id TEXT;
    counter INTEGER := 1;
BEGIN
    LOOP
        new_id := 'STU' || LPAD(counter::TEXT, 6, '0');
        
        -- Check if this ID already exists
        IF NOT EXISTS (SELECT 1 FROM public.students WHERE student_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        counter := counter + 1;
        
        -- Safety check to prevent infinite loop
        IF counter > 999999 THEN
            RAISE EXCEPTION 'Unable to generate unique student ID';
        END IF;
    END LOOP;
END;
$$;

-- Update assign_student_id function with proper search_path
CREATE OR REPLACE FUNCTION public.assign_student_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.student_id IS NULL THEN
        NEW.student_id := public.generate_student_id();
    END IF;
    RETURN NEW;
END;
$$;