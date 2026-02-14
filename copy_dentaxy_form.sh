#!/bin/bash
TARGET="src/core/packages/clinical-form"
mkdir -p $TARGET/components
mkdir -p $TARGET/ui
mkdir -p $TARGET/hooks
mkdir -p $TARGET/types

echo "Copying files..."

# Copy main
cp src/components/academico/DentaxyFormPanel.tsx $TARGET/index.tsx

# Copy components
cp -r src/components/historia-clinica/* $TARGET/components/

# Copy UI
cp src/components/academico/ui/ProgressLine.tsx $TARGET/ui/
cp src/components/academico/ui/CommandDock.tsx $TARGET/ui/
cp src/components/academico/ui/SectionCard.tsx $TARGET/ui/
cp src/components/ui/HTMLTypewriterEffect.tsx $TARGET/ui/

# Copy Hooks
cp src/hooks/useHistoriaClinica.ts $TARGET/hooks/
cp src/hooks/useGenerarTodasRedacciones.ts $TARGET/hooks/

# Copy Types
cp src/types/historiaClinica.ts $TARGET/types/

echo "Refactoring imports..."

# Replacements in index.tsx
sed -i "s|@/components/historia-clinica/|./components/|g" $TARGET/index.tsx
sed -i "s|@/hooks/|./hooks/|g" $TARGET/index.tsx
sed -i "s|@/types/|./types/|g" $TARGET/index.tsx
sed -i "s|@/components/academico/ui/|./ui/|g" $TARGET/index.tsx
sed -i "s|@/components/ui/HTMLTypewriterEffect|./ui/HTMLTypewriterEffect|g" $TARGET/index.tsx

# Replacements in hooks/ (1 level deep)
sed -i "s|@/types/|../types/|g" $TARGET/hooks/*.ts

# Replacements in components/ (1 level deep)
sed -i "s|@/types/|../../types/|g" $TARGET/components/*.tsx
sed -i "s|@/hooks/|../../hooks/|g" $TARGET/components/*.tsx
sed -i "s|@/components/ui/HTMLTypewriterEffect|../../ui/HTMLTypewriterEffect|g" $TARGET/components/*.tsx

# Replacements in components subdirs (2 levels deep)
find $TARGET/components -mindepth 2 -name "*.tsx" -exec sed -i "s|@/types/|../../../types/|g" {} +
find $TARGET/components -mindepth 2 -name "*.tsx" -exec sed -i "s|@/hooks/|../../../hooks/|g" {} +

echo "Done."
