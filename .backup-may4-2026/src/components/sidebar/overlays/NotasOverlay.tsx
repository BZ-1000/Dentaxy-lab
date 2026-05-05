import { useState } from 'react';
import { ClipboardList, Plus, Trash2, Check } from 'lucide-react';
import { BaseOverlay } from './BaseOverlay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useNotes } from '@/hooks/useNotes';
import { Badge } from '@/components/ui/badge';

interface NotasOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const NotasOverlay = ({ open, onClose }: NotasOverlayProps) => {
  const { notes, addNote, deleteNote, toggleComplete } = useNotes();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'pendiente' | 'idea' | 'tarea'>('pendiente');
  const [priority, setPriority] = useState<'alta' | 'media' | 'baja'>('media');

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    addNote({
      title,
      content,
      category,
      priority,
      completed: false,
    });

    setTitle('');
    setContent('');
    setCategory('pendiente');
    setPriority('media');
    setShowForm(false);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'pendiente': return 'bg-yellow-500';
      case 'idea': return 'bg-blue-500';
      case 'tarea': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (pri: string) => {
    switch (pri) {
      case 'alta': return '🔴';
      case 'media': return '🟡';
      case 'baja': return '🟢';
      default: return '';
    }
  };

  return (
    <BaseOverlay open={open} onClose={onClose} title="Notas de Actividad" icon={ClipboardList}>
      <div className="space-y-4">
        {showForm ? (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Input
                placeholder="Título de la nota"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Contenido (opcional)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="tarea">Tarea</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta 🔴</SelectItem>
                    <SelectItem value="media">Media 🟡</SelectItem>
                    <SelectItem value="baja">Baja 🟢</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  <Check className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setShowForm(true)} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Nota
          </Button>
        )}

        <div className="space-y-2">
          {notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay notas. Crea tu primera nota.
            </p>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className={note.completed ? 'opacity-50' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={note.completed}
                      onCheckedChange={() => toggleComplete(note.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${note.completed ? 'line-through' : ''}`}>
                          {note.title}
                        </h4>
                        <span>{getPriorityLabel(note.priority)}</span>
                      </div>
                      {note.content && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {note.content}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`text-xs ${getCategoryColor(note.category)} text-white`}>
                          {note.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.created_at).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </BaseOverlay>
  );
};
