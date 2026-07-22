-- 1. Eliminar la restricción anterior de roles
ALTER TABLE perfiles DROP CONSTRAINT IF EXISTS perfiles_rol_check;

-- 2. Crear una nueva restricción que incluya al director y coordinador
ALTER TABLE perfiles ADD CONSTRAINT perfiles_rol_check 
CHECK (rol IN ('docente', 'secretaria', 'coordinador', 'director'));