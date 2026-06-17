---
name: dentaxy-drive-architecture
description: Directiva arquitectónica estricta para el manejo de archivos, almacenamiento y gestión de pacientes en Dentaxy usando Google Drive.
---

# 🛡️ DENTAXY DRIVE ARCHITECTURE (ZERO-STORAGE POLICY)

## 📌 Contexto
Dentaxy opera bajo un modelo de privacidad extrema y eficiencia máxima. A diferencia de un SaaS tradicional que almacena bases de datos y archivos multimedia en servidores propios, Dentaxy es únicamente una **capa de visualización (Frontend Viewer)**.

## 🔴 Regla de Oro: Cero Almacenamiento Local (Zero-Storage)
**Nunca** implementes lógica que guarde, persista, almacene o envíe datos clínicos, expedientes, fotos, radiografías o perfiles de pacientes a una base de datos central de Dentaxy (Ej. Supabase, PostgreSQL, MongoDB, etc.). 

Dentaxy **NO** guarda ninguna información de los pacientes. 

## 🟢 Flujo de Trabajo y Almacenamiento: "Mis archivos dentaxy"
1. **Google Drive como Único Backend de Almacenamiento:**
   - Toda creación, lectura, actualización y eliminación (CRUD) de expedientes o pacientes debe interactuar directamente con la API de Google Drive de la cuenta con la que el usuario (el dentista) inició sesión.
2. **Carpeta Raíz Automática:**
   - Al crear una cuenta o iniciar sesión por primera vez, el sistema debe crear (o verificar la existencia de) una carpeta llamada `Mis archivos dentaxy` en la raíz del Google Drive del usuario.
3. **Estructura Interna del Drive:**
   - Dentro de `Mis archivos dentaxy`, cada paciente es una subcarpeta.
   - Todo PDF, reporte médico, historia clínica o imagen subida desde la interfaz "Agregar Paciente" de Dentaxy se guarda físicamente en esa carpeta de Drive.

## 🚀 Acciones Requeridas por el Agente (IA)
Cuando el usuario te pida crear una función como "Agregar Paciente", "Guardar documento", "Subir radiografía" o cualquier verbo que implique **Crear/Guardar/Eliminar**:
- **NO** escribas consultas SQL ni endpoints de bases de datos para guardar la data clínica.
- **SÍ** implementa funciones usando la API de Google Drive (ej. `gapi.client.drive.files.create`) para crear las carpetas y archivos correspondientes.
- Si vas a listar los pacientes, debes hacer una petición de listado (Ej. `gapi.client.drive.files.list`) buscando las carpetas dentro de `Mis archivos dentaxy`.

*Tu objetivo es asegurar que la soberanía total de los datos resida físicamente en la cuenta de Google del usuario final.*
