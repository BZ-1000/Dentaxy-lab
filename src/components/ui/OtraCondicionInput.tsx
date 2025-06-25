
import React, { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface OtraCondicion {
  id: string;
  condicion: string;
  descripcion: string;
}

interface OtraCondicionInputProps {
  condicion: OtraCondicion;
  onChange: (field: 'condicion' | 'descripcion', value: string) => void;
  onRemove: () => void;
  theme: string;
}

export const OtraCondicionInput = forwardRef<HTMLDivElement, OtraCondicionInputProps>(
  ({ condicion, onChange, onRemove, theme }, ref) => {
    return (
      <div ref={ref} className={`p-4 border rounded-lg ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'} space-y-3`}>
        <div className="flex items-center justify-between">
          <Label className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Otra Condición
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <Input
            placeholder="Nombre de la condición"
            value={condicion.condicion}
            onChange={(e) => onChange('condicion', e.target.value)}
            className={`${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
          />
          <Textarea
            placeholder="Descripción detallada..."
            value={condicion.descripcion}
            onChange={(e) => onChange('descripcion', e.target.value)}
            className={`min-h-[80px] ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
          />
        </div>
      </div>
    );
  }
);

OtraCondicionInput.displayName = 'OtraCondicionInput';

export default OtraCondicionInput;
