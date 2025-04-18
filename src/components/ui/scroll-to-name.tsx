
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export const ScrollToNameButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const nameInput = document.querySelector('#patient-name-input');
    
    const checkScroll = () => {
      if (nameInput) {
        const rect = nameInput.getBoundingClientRect();
        setIsVisible(rect.top < 0);
      }
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

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
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};
