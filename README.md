# Johan 80 Horas - Temporizador de Productividad

Una aplicación de temporizador para seguimiento de horas de trabajo sin distracciones.

## Características

- ⏱️ Temporizador con pantalla completa
- 📊 Analytics y estadísticas detalladas
- 🎯 Metas semanales personalizables
- 💾 Almacenamiento en Supabase
- 📱 Diseño responsive
- ⌨️ Atajos de teclado

## Deployment en Vercel

### Pasos para desplegar:

1. **Conecta tu repositorio a Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub/GitLab
   - Importa este repositorio

2. **Configura las variables de entorno:**
   En el dashboard de Vercel, agrega estas variables:
   ```
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

3. **Deploy automático:**
   - Vercel detectará automáticamente que es un proyecto Vite
   - Usará la configuración de `vercel.json`
   - El build se ejecutará automáticamente

### Comandos locales:

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Configuración de Supabase

Asegúrate de tener configuradas las siguientes tablas en Supabase:
- `johan_users`
- `johan_sessions`
- `johan_settings`

## Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Recharts
- React Router DOM