/*
  # Esquema de base de datos para FocusTimer

  1. Nuevas Tablas
    - `johan_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `johan_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `duration` (integer, seconds)
      - `source` (text, default 'web')
      - `created_at` (timestamp)
    
    - `johan_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key, unique)
      - `weekly_goal` (integer, hours, default 80)
      - `exit_fullscreen_on_pause` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para que usuarios solo accedan a sus propios datos
    - Políticas de inserción, lectura y actualización

  3. Índices
    - Índices en campos de búsqueda frecuente
    - Índices compuestos para consultas de rango de fechas
    - Índices únicos para constraints
*/

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS johan_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear tabla de sesiones de trabajo
CREATE TABLE IF NOT EXISTS johan_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  duration integer NOT NULL CHECK (duration > 0),
  source text DEFAULT 'web',
  created_at timestamptz DEFAULT now()
);

-- Crear tabla de configuraciones de usuario
CREATE TABLE IF NOT EXISTS johan_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  weekly_goal integer DEFAULT 80 CHECK (weekly_goal > 0 AND weekly_goal <= 168),
  exit_fullscreen_on_pause boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE johan_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE johan_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE johan_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para johan_users
CREATE POLICY "Users can read own profile"
  ON johan_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON johan_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON johan_users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas para johan_sessions
CREATE POLICY "Users can read own sessions"
  ON johan_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own sessions"
  ON johan_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
  ON johan_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Políticas para johan_settings
CREATE POLICY "Users can read own settings"
  ON johan_settings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
  ON johan_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON johan_settings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS johan_users_email_idx ON johan_users (email);
CREATE INDEX IF NOT EXISTS johan_sessions_user_id_idx ON johan_sessions (user_id);
CREATE INDEX IF NOT EXISTS johan_sessions_start_time_idx ON johan_sessions (start_time DESC);
CREATE INDEX IF NOT EXISTS johan_sessions_user_date_idx ON johan_sessions (user_id, start_time DESC);
CREATE INDEX IF NOT EXISTS johan_sessions_duration_idx ON johan_sessions (duration);
CREATE INDEX IF NOT EXISTS johan_settings_user_id_idx ON johan_settings (user_id);

-- Agregar foreign keys
ALTER TABLE johan_sessions 
ADD CONSTRAINT johan_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES johan_users(id) ON DELETE CASCADE;

ALTER TABLE johan_settings 
ADD CONSTRAINT johan_settings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES johan_users(id) ON DELETE CASCADE;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION johan_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER johan_users_updated_at
  BEFORE UPDATE ON johan_users
  FOR EACH ROW
  EXECUTE FUNCTION johan_update_updated_at();

CREATE TRIGGER johan_settings_updated_at
  BEFORE UPDATE ON johan_settings
  FOR EACH ROW
  EXECUTE FUNCTION johan_update_updated_at();

-- Función para crear configuración por defecto al registrar usuario
CREATE OR REPLACE FUNCTION johan_create_default_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO johan_settings (user_id, weekly_goal, exit_fullscreen_on_pause)
  VALUES (NEW.id, 80, true)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear configuración automáticamente
CREATE TRIGGER johan_create_user_settings
  AFTER INSERT ON johan_users
  FOR EACH ROW
  EXECUTE FUNCTION johan_create_default_settings();