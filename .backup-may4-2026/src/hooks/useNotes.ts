import { useState, useEffect, useCallback } from 'react';
import { Note } from '@/types/sidebar';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'dentaxy_notes';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveNotes = useCallback((newNotes: Note[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
      setNotes(newNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron guardar las notas',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const addNote = useCallback((note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveNotes([...notes, newNote]);
    toast({
      title: 'Nota creada',
      description: 'La nota se guardó correctamente',
    });
  }, [notes, saveNotes, toast]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    const updated = notes.map(note =>
      note.id === id ? { ...note, ...updates, updated_at: new Date().toISOString() } : note
    );
    saveNotes(updated);
    toast({
      title: 'Nota actualizada',
      description: 'Los cambios se guardaron',
    });
  }, [notes, saveNotes, toast]);

  const deleteNote = useCallback((id: string) => {
    const filtered = notes.filter(note => note.id !== id);
    saveNotes(filtered);
    toast({
      title: 'Nota eliminada',
      description: 'La nota se eliminó correctamente',
    });
  }, [notes, saveNotes, toast]);

  const toggleComplete = useCallback((id: string) => {
    const updated = notes.map(note =>
      note.id === id ? { ...note, completed: !note.completed, updated_at: new Date().toISOString() } : note
    );
    saveNotes(updated);
  }, [notes, saveNotes]);

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    toggleComplete,
  };
};
