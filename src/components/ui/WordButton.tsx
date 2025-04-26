
import React from 'react';

interface WordButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const WordButton = ({
  label,
  isSelected,
  onClick
}: WordButtonProps) => {
  return (
    <button 
      onClick={onClick} 
      className={`px-2 py-1 text-xs rounded-md transition-colors mb-1 mr-1 ${
        isSelected 
          ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200" 
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );
};

export default WordButton;
