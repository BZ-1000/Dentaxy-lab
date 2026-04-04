#!/bin/bash
cd /home/bz1000/Dentaxy-lab

echo "--- Agregando todos los cambios ---"
git add -A

echo "--- Commit de despliegue ---"
git commit -m "Deploy: Actualización completa del ecosistema (navegación, páginas nuevas y manual técnico V2.0)"

echo "--- Push a main ---"
git push origin main
