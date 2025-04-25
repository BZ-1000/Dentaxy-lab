
/**
 * AutoSave Manager - Handles automatic saving of form data
 * 
 * This utility provides functions to automatically save and restore form data
 * when users switch tabs or navigate away from the page.
 */

import { FormDataState } from '@/types/historiaClinica';
import { getInitialFormState } from './initialFormState';

// Save form data for a specific patient
export const saveFormData = (pacienteName: string, formData: FormDataState): void => {
  if (!pacienteName) return;
  
  try {
    localStorage.setItem(`formulario_${pacienteName}`, JSON.stringify(formData));
    // Also update the auto-save backup
    localStorage.setItem(`auto_save_${pacienteName}`, JSON.stringify(formData));
    console.log(`Form data saved for patient: ${pacienteName}`);
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

// Load form data for a specific patient
export const loadFormData = (pacienteName: string): FormDataState => {
  if (!pacienteName) return getInitialFormState();
  
  try {
    // Try to get the regular saved data first
    const savedData = localStorage.getItem(`formulario_${pacienteName}`);
    if (savedData) {
      return JSON.parse(savedData);
    }
    
    // If no regular save exists, try to get auto-saved data
    const autoSavedData = localStorage.getItem(`auto_save_${pacienteName}`);
    if (autoSavedData) {
      console.log(`Recovered auto-saved data for patient: ${pacienteName}`);
      return JSON.parse(autoSavedData);
    }
  } catch (error) {
    console.error('Error loading form data:', error);
  }
  
  return getInitialFormState();
};

// Auto-save form data (called periodically)
export const autoSaveForm = (pacienteName: string, formData: FormDataState): void => {
  if (!pacienteName) return;
  
  try {
    localStorage.setItem(`auto_save_${pacienteName}`, JSON.stringify(formData));
    console.log(`Auto-saved form data for patient: ${pacienteName}`);
  } catch (error) {
    console.error('Error auto-saving form data:', error);
  }
};

// Check if there's any auto-saved data that hasn't been properly saved
export const checkForUnsavedData = (): string[] => {
  const unsavedPatients: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('auto_save_')) {
      const pacienteName = key.replace('auto_save_', '');
      const regularSaveKey = `formulario_${pacienteName}`;
      
      // Check if the auto-save is different from the regular save
      const autoSaveData = localStorage.getItem(key);
      const regularSaveData = localStorage.getItem(regularSaveKey);
      
      if (autoSaveData && (!regularSaveData || autoSaveData !== regularSaveData)) {
        unsavedPatients.push(pacienteName);
      }
    }
  }
  
  return unsavedPatients;
};

// Recover unsaved data for a specific patient
export const recoverUnsavedData = (pacienteName: string): FormDataState | null => {
  try {
    const autoSaveKey = `auto_save_${pacienteName}`;
    const autoSaveData = localStorage.getItem(autoSaveKey);
    
    if (autoSaveData) {
      // Move auto-save to regular save
      localStorage.setItem(`formulario_${pacienteName}`, autoSaveData);
      return JSON.parse(autoSaveData);
    }
  } catch (error) {
    console.error('Error recovering unsaved data:', error);
  }
  
  return null;
};

// Delete all data for a specific patient
export const deletePatientData = (pacienteName: string): void => {
  try {
    localStorage.removeItem(`formulario_${pacienteName}`);
    localStorage.removeItem(`auto_save_${pacienteName}`);
    console.log(`Deleted all data for patient: ${pacienteName}`);
  } catch (error) {
    console.error('Error deleting patient data:', error);
  }
};
