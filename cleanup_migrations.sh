#!/bin/bash

# Define the target directory
MIGRATIONS_DIR="/home/bz1000/Dentaxy-lab/supabase/migrations"

# Verify directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "Error: Directory $MIGRATIONS_DIR does not exist."
    exit 1
fi

echo "Cleaning up migration files older than 24 hours in $MIGRATIONS_DIR..."

# Find and delete files older than 1 day (24 hours)
# -mtime +0 means older than 24 hours
find "$MIGRATIONS_DIR" -maxdepth 1 -name "*.sql" -type f -mtime +0 -print -delete

echo "Cleanup complete."
