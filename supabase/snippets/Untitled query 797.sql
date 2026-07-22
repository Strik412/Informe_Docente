-- 1. Tabla de Perfiles (para saber el rol de cada usuario)
CREATE TABLE perfiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nombre TEXT,
  rol TEXT CHECK (rol IN ('docente', 'secretaria', 'coordinador'))
);

-- 2. Tabla Principal del Informe (Sección 1, 6 y 7)
CREATE TABLE informes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  docente_id UUID REFERENCES perfiles(id) NOT NULL,
  periodo TEXT NOT NULL,
  cumplimiento_global TEXT,
  mejora_continua TEXT,
  estado TEXT DEFAULT 'borrador',
  fecha_creacion TIMESTAMP DEFAULT now()
);

-- 3. Tabla de Asignaturas (Sección 2 - Exclusivo del Docente)
CREATE TABLE asignaturas_evaluacion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  informe_id UUID REFERENCES informes(id) ON DELETE CASCADE,
  carrera TEXT,
  materia TEXT,
  resultados_aprendizaje JSONB, -- Guardaremos las tablas internas como JSON para mayor rapidez
  habilidades_blandas JSONB,
  tacs JSONB
);

-- 4. Tabla de Gestión Académica (Sección 3 - Exclusivo de Secretaría/Coordinación)
CREATE TABLE gestion_academica (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  informe_id UUID REFERENCES informes(id) ON DELETE CASCADE,
  tipo_tutoria TEXT, -- 'titulacion', 'lector', 'practicas'
  estudiante TEXT,
  titulo_o_empresa TEXT,
  estado TEXT
);

-- ==========================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security)
-- ==========================================

-- Habilitar seguridad en las tablas
ALTER TABLE informes ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignaturas_evaluacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE gestion_academica ENABLE ROW LEVEL SECURITY;

-- Política 1: Los docentes pueden crear y editar sus propios informes
CREATE POLICY "Docentes gestionan sus informes" ON informes
  FOR ALL USING (
    auth.uid() = docente_id
  );

-- Política 2: Secretaría/Coordinadores pueden VER todos los informes
CREATE POLICY "Admin ven informes" ON informes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('secretaria', 'coordinador'))
  );

-- Política 3: Docentes editan sus bloques de asignaturas
CREATE POLICY "Docentes editan asignaturas" ON asignaturas_evaluacion
  FOR ALL USING (
    EXISTS (SELECT 1 FROM informes WHERE informes.id = asignaturas_evaluacion.informe_id AND informes.docente_id = auth.uid())
  );

-- Política 4: Secretaría/Coordinadores editan Gestión Académica
CREATE POLICY "Admin edita gestion" ON gestion_academica
  FOR ALL USING (
    EXISTS (SELECT 1 FROM perfiles WHERE id = auth.uid() AND rol IN ('secretaria', 'coordinador'))
  );

-- Política 5: Docentes solo pueden VER la Gestión Académica (No editar)
CREATE POLICY "Docentes ven gestion" ON gestion_academica
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM informes WHERE informes.id = gestion_academica.informe_id AND informes.docente_id = auth.uid())
  );