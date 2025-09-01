/*
  # Crear usuario predeterminado para Johan

  1. Nuevo Usuario
    - Crea un usuario predeterminado con email johan@focustimer.app
    - Configura perfil automático en johan_users
    - Establece configuración inicial en johan_settings

  2. Seguridad
    - Mantiene RLS pero permite acceso directo
    - Usuario específico para uso personal
*/

-- Insertar usuario predeterminado en johan_users
INSERT INTO johan_users (id, email, full_name, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'johan@focustimer.app',
  'Johan',
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Insertar configuración predeterminada
INSERT INTO johan_settings (user_id, weekly_goal, exit_fullscreen_on_pause, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  80,
  true,
  now(),
  now()
) ON CONFLICT (user_id) DO NOTHING;