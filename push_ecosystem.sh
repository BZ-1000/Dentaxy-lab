#!/bin/bash
cd /home/bz1000/Dentaxy-lab

echo "--- Status antes ---"
git status --short

echo "--- Añadiendo archivos ---"
git add src/pages/ecosystem/

echo "--- Status después de añadir ---"
git status --short

echo "--- Haciendo commit ---"
git commit -m "fix: Añadir archivos de ecosystem faltantes"

echo "--- Haciendo push ---"
git push origin main
