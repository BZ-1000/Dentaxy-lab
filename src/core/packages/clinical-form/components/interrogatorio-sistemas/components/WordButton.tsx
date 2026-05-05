import React from 'react';

interface WordButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export const WordButton: React.FC<WordButtonProps> = ({ label, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2 py-1 text-xs rounded-md transition-colors mb-1 mr-1 ${
        isSelected
          ? "bg-zinc-800 text-white shadow-sm"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );
};

export default WordButton;
