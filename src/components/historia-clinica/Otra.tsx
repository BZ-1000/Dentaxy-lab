
import React from "react";
import { Input } from "@/components/ui/input";

interface OtraProps {
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const Otra: React.FC<OtraProps> = ({ value, onChange, onFocus, onBlur, inputRef }) => {
  return (
    <div className="w-full mt-2">
      <Input
        ref={inputRef}
        placeholder="Especificar otra condición..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default Otra;

