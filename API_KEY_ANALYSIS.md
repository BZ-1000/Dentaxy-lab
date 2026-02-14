# API Key Validation Failure

## Problem
The "Invalid API key" error persists because the Supabase Anon Key provided is not valid for the project `ooepkqxwywfcfhkpzphe`.

## Testing Performed
I tested the API key directly using curl:
```bash
curl -X GET 'https://ooepkqxwywfcfhkpzphe.supabase.co/rest/v1/dentaxy_modules?select=*' \
  -H "apikey: eyJhbGci...9r4" \
  -H "Authorization: Bearer eyJhbGci...9r4"
```

Result: **401 Unauthorized** - Supabase rejected the key.

## Root Cause
The API key is either:
1. From a different Supabase project
2. Has been regenerated/rotated
3. Was copied incorrectly

## Solution Required
Please provide the correct **anon public** key from:
https://app.supabase.com/project/ooepkqxwywfcfhkpzphe/settings/api

Look for the key labeled "anon" or "public" (NOT service_role).
