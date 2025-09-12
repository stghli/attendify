-- Add unique student_id field to students table
ALTER TABLE public.students 
ADD COLUMN student_id TEXT UNIQUE;

-- Create index for better performance on student_id lookups
CREATE INDEX idx_students_student_id ON public.students(student_id);

-- Create function to generate unique student ID
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TEXT
LANGUAGE plpgsql
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

-- Create function to auto-assign student ID on insert
CREATE OR REPLACE FUNCTION public.assign_student_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.student_id IS NULL THEN
        NEW.student_id := public.generate_student_id();
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to auto-assign student ID
CREATE TRIGGER trigger_assign_student_id
    BEFORE INSERT ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.assign_student_id();