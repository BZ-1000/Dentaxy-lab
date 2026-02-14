# Guía de Deployment: Edge Functions de Autenticación Biométrica

## Requisitos Previos

1. **Supabase CLI instalado**:
   ```bash
   npm install -g supabase
   ```

2. **Login en Supabase**:
   ```bash
   supabase login
   ```

3. **Link al proyecto**:
   ```bash
   supabase link --project-ref ooepkqxwywfcfhkpzphe
   ```

## Deployment de las Edge Functions

### Opción 1: Deploy Todas las Funciones

```bash
cd /home/bz1000/Dentaxy-lab
supabase functions deploy register-passkey-challenge
supabase functions deploy register-passkey-verify
supabase functions deploy authenticate-passkey-challenge
supabase functions deploy authenticate-passkey-verify
```

### Opción 2: Deploy Individual

Para debuggear o actualizar una función específica:

```bash
supabase functions deploy <function-name>
```

## Configuración de Variables de Entorno

Las Edge Functions ya usan automáticamente:
- `SUPABASE_URL` - URL de tu proyecto
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (con permisos admin)

Estas se inyectan automáticamente por Supabase.

## Testing Local (Opcional)

Para probar las funciones localmente antes de deploy:

```bash
# Iniciar Supabase local
supabase start

# Servir función específica
supabase functions serve register-passkey-challenge --env-file .env.local
```

## Verificación Post-Deployment

Una vez deployadas, las funciones estarán disponibles en:

```
https://ooepkqxwywfcfhkpzphe.supabase.co/functions/v1/register-passkey-challenge
https://ooepkqxwywfcfhkpzphe.supabase.co/functions/v1/register-passkey-verify
https://ooepkqxwywfcfhkpzphe.supabase.co/functions/v1/authenticate-passkey-challenge
https://ooepkqxwywfcfhkpzphe.supabase.co/functions/v1/authenticate-passkey-verify
```

## Troubleshooting

### Error: "Function not found"
- Verifica que estás linkeado al proyecto correcto: `supabase link --project-ref ooepkqxwywfcfhkpzphe`

### Error: "Import not found"
- Las Edge Functions usan Deno, los imports deben ser URLs completas (esm.sh)

### Error de CORS
- Ya están configurados los headers CORS en cada función

## Logs de las Funciones

Para ver logs en tiempo real:

```bash
supabase functions logs <function-name> --follow
```

## Notas Importantes

- Las Edge Functions se ejecutan en Deno, no Node.js
- Los imports son de `https://esm.sh/` (CDN para módulos npm)
- SimpleWebAuthn se importa desde esm.sh automáticamente
- El `SERVICE_ROLE_KEY` permite bypass de RLS (necesario para operaciones admin)
