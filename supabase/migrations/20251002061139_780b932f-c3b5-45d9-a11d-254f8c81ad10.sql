-- Create landing page settings table
CREATE TABLE IF NOT EXISTS public.landing_page_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_enabled boolean NOT NULL DEFAULT true,
  welcome_message text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.landing_page_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage landing page settings
CREATE POLICY "Admins can manage landing page settings"
ON public.landing_page_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view landing page settings (needed for public access)
CREATE POLICY "Anyone can view landing page settings"
ON public.landing_page_settings
FOR SELECT
USING (true);

-- Insert default settings
INSERT INTO public.landing_page_settings (is_enabled, welcome_message)
VALUES (true, 'Welcome to our attendance system');

-- Add trigger to update updated_at
CREATE TRIGGER update_landing_page_settings_updated_at
BEFORE UPDATE ON public.landing_page_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();