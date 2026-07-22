-- Otorgar permisos de uso del esquema público
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Otorgar permisos de lectura, escritura y actualización en todas las tablas actuales
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Otorgar permisos en las secuencias (necesario para los IDs automáticos)
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;