---
name: dentaxy-drive-architecture
description: Directiva arquitectónica estricta para el manejo de archivos, almacenamiento y gestión de pacientes en Dentaxy usando Google Drive.
---

# 🛡️ DENTAXY DRIVE ARCHITECTURE (ZERO-STORAGE POLICY)

## 📌 Contexto
Dentaxy opera bajo un modelo de privacidad extrema. Los datos clínicos y expedientes NO se guardan en una base de datos central de Dentaxy. En lugar de eso, cada médico es **dueño de sus propios datos** alojados en su propio Google Drive. Dentaxy es **exclusivamente una interfaz** de creación y visualización.

## 🔴 Regla de Oro: Cero Almacenamiento Local o de Backend (Zero-Storage)
**Nunca** implementes lógica que guarde, persista, almacene o envíe datos clínicos, expedientes, fotos, radiografías o perfiles de pacientes a Supabase, PostgreSQL, MongoDB o **cualquier API backend externa (incluyendo endpoints de Vercel locales)**.

## 🟢 Flujo de Trabajo: 100% Frontend Client-Side API

1. **Autenticación Frontend (Session Storage):**
   - El login se hace exclusivamente en el frontend usando `@react-oauth/google` con los scopes necesarios (`userinfo.profile`, `drive.file`, etc.).
   - El Token de Acceso (`googleAccessToken`) se guarda en memoria y en `sessionStorage` (`seed_user`).

2. **Creación y Visualización de Expedientes (Directo a Google Drive):**
   - Cuando se añade un paciente, se crean carpetas y subcarpetas llamando a la **API oficial de Google Drive** directamente desde el navegador (usando `fetch('https://www.googleapis.com/drive/v3/...')`) con el `googleAccessToken`.
   - El frontend es el que interroga a Google Drive para saber qué pacientes existen, buscar archivos y mostrar metadatos.
   - Las cargas de archivos (PDFs, imágenes) van directo del navegador del usuario a Google Drive, sin tocar ningún intermediario.

3. **No Dependencia de Supabase para Autorización Drive:**
   - La base de datos de Supabase no guarda `refresh_tokens`. Todo el estado de sesión de Google Drive recae sobre el ciclo de vida del token en el cliente y la cuenta local del usuario.

*Tu objetivo es asegurar que la soberanía total de los datos resida físicamente en la cuenta de Google del usuario final y que todo el código sea cliente-céntrico, minimizando componentes de backend al absoluto cero para operaciones de expedientes.*
