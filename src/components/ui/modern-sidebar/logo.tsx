
import React from 'react';

interface LogoProps {
  children: React.ReactNode;
}

export const Logo = ({ children }: LogoProps) => {
  return (
    <div className="flex items-center px-4 py-5 h-14 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
};

interface LogoIconProps {
  children: React.ReactNode;
}

export const LogoIcon = ({ children }: LogoIconProps) => {
  return (
    <div className="flex items-center justify-center py-5 h-14 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        {children}
      </div>
    </div>
  );
};
