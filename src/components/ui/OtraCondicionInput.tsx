
import React, { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface OtraCondicionInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onBlur?: () => void;
}

const OtraCondicionInput = forwardRef<HTMLTextAreaElement, OtraCondicionInputProps>(
  ({ placeholder, value, onChange, className, onBlur }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    return (
      <Textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={className}
        onBlur={onBlur}
      />
    );
  }
);

OtraCondicionInput.displayName = 'OtraCondicionInput';

export default OtraCondicionInput;
