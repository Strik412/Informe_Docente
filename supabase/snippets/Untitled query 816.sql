-- 1. Eliminamos las tablas anteriores y sus dependencias (CASCADE)
DROP TABLE IF EXISTS gestion_academica CASCADE;
DROP TABLE IF EXISTS asignaturas_evaluacion CASCADE;
DROP TABLE IF EXISTS informes CASCADE;

-- 2. Creamos la tabla principal de informes usando JSONB para las secciones complejas
CREATE TABLE informes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  docente_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Datos principales
  docente_nombre TEXT,
  periodo TEXT,
  estado TEXT DEFAULT 'Pendiente de Secretaria',
  
  -- Secciones agrupadas en JSONB (Perfecto para React)
  actividades_docencia JSONB,
  evaluaciones_asignaturas JSONB, 
  investigacion JSONB,
  vinculacion JSONB,
  
  -- Cierre y Evidencias
  mejora_continua TEXT,
  cumplimiento_global TEXT,
  evidencias TEXT,
  fecha_elaboracion DATE,
  firma_docente TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabla para la Secretaría (Se enlazará al informe cuando lo completen)
CREATE TABLE gestion_academica (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  informe_id UUID REFERENCES informes(id) ON DELETE CASCADE,
  datos_gestion JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Otorgar permisos básicos
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;