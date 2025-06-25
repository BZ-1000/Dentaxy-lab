
import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface OtraCondicionInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  placeholder?: string;
}

const OtraCondicionInput: React.FC<OtraCondicionInputProps> = ({
  value,
  onChange,
  onRemove,
  placeholder = "Especificar otra condición..."
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        delay: 0.1,
        repeat: 0,
        duration: 0.3,
        ease: "easeInOut"
      }}
      className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
    >
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400"
      />
      <Button
        onClick={onRemove}
        variant="ghost"
        size="sm"
        className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 p-1 h-8 w-8"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default OtraCondicionInput;
