import React from 'react';
import type { Tool } from '../types';

interface HeaderProps {
  tool: Tool | null;
}

const Header: React.FC<HeaderProps> = ({ tool }) => {
  return (
    <header className="flex h-16 flex-shrink-0 items-center border-b border-blue-950 bg-blue-900 px-4 sm:px-6 md:px-8">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold text-white">
          {tool ? tool.title : 'MAS AI Tools'}
        </h1>
        {/* Placeholder for future actions like user profile, settings, etc. */}
      </div>
    </header>
  );
};

export default Header;