-- Aseguramos que la tabla tenga la seguridad activa
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;

-- Creamos una política para que cualquier usuario que inicie sesión pueda leer los perfiles
CREATE POLICY "Permitir lectura de perfiles" ON perfiles
  FOR SELECT USING ( auth.role() = 'authenticated' );