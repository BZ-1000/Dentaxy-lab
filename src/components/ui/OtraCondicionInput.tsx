
import React from "react";

interface OtraCondicionInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const OtraCondicionInput: React.FC<OtraCondicionInputProps> = ({ value, onChange, className }) => {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm shadow-inner ${className ?? ""}`}
      style={{ minHeight: '2.5rem', maxHeight: '5rem' }} // similar height to input, allow some resizing vertically if wanted
    />
  );
};

export default OtraCondicionInput;

