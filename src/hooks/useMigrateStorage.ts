import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserStorage } from '@/utils/userStorage';

/**
 * Hook para migrar datos antiguos de localStorage al nuevo formato por usuario
 * 
 * Este hook se ejecuta una sola vez cuando el usuario inicia sesión y migra
 * todos los datos antiguos (sin prefijo de usuario) al nuevo formato con prefijo.
 */
export const useMigrateStorage = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    // Verificar si ya se realizó la migración para este usuario
    const migrationKey = `migration_completed_${user.id}`;
    if (localStorage.getItem(migrationKey)) return;
    
    console.log('Iniciando migración de datos para el usuario:', user.email);
    
    // Lista de claves a migrar
    const keysToMigrate = [
      'currentFormData',
      'dentaxy_username',
      'interrogatorio-sistemas-formValues',
      'examen-intrabucal-encias',
      'examen-intrabucal-paladar',
      'examen-intrabucal-orofaringe',
      'examen-intrabucal-mejillas',
      'examen-intrabucal-retromolar',
      'examen-intrabucal-lengua',
      'examen-intrabucal-pisoBoca'
    ];
    
    // Migrar claves específicas
    keysToMigrate.forEach(key => {
      UserStorage.migrateOldData(user, key);
    });
    
    // Migrar todos los formularios guardados
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('formulario_')) {
        UserStorage.migrateOldData(user, key);
      }
    }
    
    // Marcar migración como completada
    localStorage.setItem(migrationKey, 'true');
    console.log('Migración completada para el usuario:', user.email);
  }, [user]);
};
