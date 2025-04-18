'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react'; // Cambia el ícono a Save
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ScrollToNameButtonProps {
  isSaveButtonHidden: boolean;
}

const ScrollToNameButton: React.FC<ScrollToNameButtonProps> = ({ isSaveButtonHidden }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const nameInput = document.querySelector('#patient-name-input');

    const checkScroll = () => {
      if (nameInput) {
        const rect = nameInput.getBoundingClientRect();
        setIsVisible(rect.top < 0);
      }
    };

    if (isSaveButtonHidden) {
      window.addEventListener('scroll', checkScroll);
    } else {
      setIsVisible(false);
    }

    return () => window.removeEventListener('scroll', checkScroll);
  }, [isSaveButtonHidden]);

  const scrollToName = () => {
    const nameInput = document.querySelector('#patient-name-input');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth' });
      const input = nameInput.querySelector('input');
      if (input) {
        input.focus();
      }
    }
  };

  return (
    <Button
      onClick={scrollToName}
      className={cn(
        'fixed right-20 top-4 z-50 size-10 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0 pointer-events-none'
      )}
      aria-label="Scroll to patient name"
    >
      <Save className="h-5 w-5 text-white" /> {/* Cambia el ícono a Save y ajusta el color */}
    </Button>
  );
};

export default ScrollToNameButton;
