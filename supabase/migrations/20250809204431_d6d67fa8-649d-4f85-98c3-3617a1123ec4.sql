-- Create educational_resources table for articles, books, guides, etc.
CREATE TABLE public.educational_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('article', 'book', 'guide', 'video', 'course')),
  category TEXT NOT NULL CHECK (category IN ('clinica', 'diagnostico', 'tratamiento', 'investigacion', 'general')),
  url TEXT,
  image_url TEXT,
  author TEXT,
  publication_date DATE,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.educational_resources ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (everyone can view resources)
CREATE POLICY "Educational resources are viewable by everyone" 
ON public.educational_resources 
FOR SELECT 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_educational_resources_updated_at
BEFORE UPDATE ON public.educational_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.educational_resources (title, description, type, category, author, publication_date, is_featured) VALUES
('Anatomía Dental Básica', 'Guía completa sobre la anatomía dental fundamental para estudiantes', 'article', 'clinica', 'Dr. Martinez', '2024-01-15', true),
('Manual de Diagnóstico Oral', 'Técnicas avanzadas de diagnóstico en odontología', 'book', 'diagnostico', 'Dra. Rodriguez', '2023-12-01', false),
('Protocolos de Emergencia Dental', 'Guía práctica para manejo de emergencias dentales', 'guide', 'tratamiento', 'Dr. Silva', '2024-02-10', true);