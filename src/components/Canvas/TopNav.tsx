import { ReactNode } from 'react';

interface TopNavProps {
  children: ReactNode;
}

export const TopNav = ({ children }: TopNavProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 z-50 shadow-sm">
      <div className="h-full max-w-[1920px] mx-auto px-6 flex justify-between items-center">
        {children}
      </div>
    </div>
  );
};