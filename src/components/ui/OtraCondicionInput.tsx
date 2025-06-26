
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface OtraCondicionInputProps {
  onAdd: (condicion: string) => void;
  placeholder?: string;
}

const OtraCondicionInput: React.FC<OtraCondicionInputProps> = ({
  onAdd,
  placeholder = "Agregar otra condición..."
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" variant="outline" size="icon" disabled={!value.trim()}>
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default OtraCondicionInput;
