import { User } from '@supabase/supabase-js';

/**
 * UserStorage - Almacenamiento local específico por usuario
 * 
 * Esta clase permite almacenar datos en localStorage con un prefijo
 * basado en el ID del usuario, asegurando que cada usuario tenga
 * su propio espacio de almacenamiento separado.
 */
export class UserStorage {
  /**
   * Obtiene el prefijo único para el usuario actual
   * @param user - Usuario de Supabase o null
   * @returns Prefijo en formato "user_{userId}_" o "guest_" si no hay usuario
   */
  private static getUserPrefix(user: User | null): string {
    if (!user?.id) return 'guest_';
    return `user_${user.id}_`;
  }

  /**
   * Guarda un valor en localStorage con prefijo de usuario
   * @param user - Usuario actual
   * @param key - Clave de almacenamiento
   * @param value - Valor a almacenar (se convertirá a JSON)
   */
  static setItem(user: User | null, key: string, value: any): void {
    if (typeof window === 'undefined') return;
    const prefixedKey = this.getUserPrefix(user) + key;
    localStorage.setItem(prefixedKey, JSON.stringify(value));
  }

  /**
   * Obtiene un valor de localStorage con prefijo de usuario
   * @param user - Usuario actual
   * @param key - Clave de almacenamiento
   * @returns Valor parseado o null si no existe
   */
  static getItem(user: User | null, key: string): any {
    if (typeof window === 'undefined') return null;
    const prefixedKey = this.getUserPrefix(user) + key;
    const item = localStorage.getItem(prefixedKey);
    if (!item) return null;

    try {
      return JSON.parse(item);
    } catch (e) {
      console.error('Error parsing localStorage item:', e);
      return null;
    }
  }

  /**
   * Elimina un valor de localStorage con prefijo de usuario
   * @param user - Usuario actual
   * @param key - Clave de almacenamiento
   */
  static removeItem(user: User | null, key: string): void {
    if (typeof window === 'undefined') return;
    const prefixedKey = this.getUserPrefix(user) + key;
    localStorage.removeItem(prefixedKey);
  }

  /**
   * Obtiene todas las claves almacenadas para el usuario actual
   * @param user - Usuario actual
   * @returns Array de claves (sin el prefijo de usuario)
   */
  static getAllUserKeys(user: User | null): string[] {
    if (typeof window === 'undefined') return [];
    const prefix = this.getUserPrefix(user);
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        keys.push(key.replace(prefix, ''));
      }
    }

    return keys;
  }

  /**
   * Limpia todos los datos del usuario actual de localStorage
   * @param user - Usuario actual
   */
  static clearUserData(user: User | null): void {
    if (typeof window === 'undefined') return;
    const prefix = this.getUserPrefix(user);
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Migra datos antiguos (sin prefijo) al formato con prefijo de usuario
   * @param user - Usuario actual
   * @param oldKey - Clave antigua sin prefijo
   */
  static migrateOldData(user: User | null, oldKey: string): void {
    if (typeof window === 'undefined') return;
    // Solo migrar si el dato antiguo existe y el nuevo no
    const oldData = localStorage.getItem(oldKey);
    const newKey = this.getUserPrefix(user) + oldKey;

    if (oldData && !localStorage.getItem(newKey)) {
      localStorage.setItem(newKey, oldData);
      console.log(`Migrated ${oldKey} to ${newKey}`);
    }
  }
}
