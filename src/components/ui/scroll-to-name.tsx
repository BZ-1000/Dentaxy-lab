
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { DockItem, DockIcon, DockLabel } from './dock';
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
    <div 
      className={cn(
        'fixed bottom-2 z-50 transition-all duration-500 ease-in-out transform',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
      )}
      style={{ left: 'calc(50% + 140px)' }} // Position it next to the dock items
    >
      <DockItem
        onClick={scrollToName}
        className='aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 cursor-pointer'
      >
        <DockLabel>Volver arriba</DockLabel>
        <DockIcon>
          <ArrowUp className='h-full w-full text-neutral-600 dark:text-neutral-300' />
        </DockIcon>
      </DockItem>
    </div>
  );
};

