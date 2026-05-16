#!/bin/bash
# Wrapper visible para Gemini Vertex AI — Dentaxy
LOGFILE="/home/bz1000/Dentaxy-lab/.gemini.log"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOGFILE"
echo "🕐 $(date '+%H:%M:%S') — Antigravity invocó Gemini" | tee -a "$LOGFILE"
echo "📄 Archivo: $1" | tee -a "$LOGFILE"
echo "📝 Instrucción: ${@:2}" | tee -a "$LOGFILE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" | tee -a "$LOGFILE"
bun run /home/bz1000/Dentaxy-lab/scripts/gemini-assistant.ts "$@" 2>&1 | tee -a "$LOGFILE"
echo "" | tee -a "$LOGFILE"
