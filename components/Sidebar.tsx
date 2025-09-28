import React from 'react';
import { TOOLS } from '../constants';
import { HomeIcon, MasAiLogo } from './icons';
import type { Tool } from '../types';

interface SidebarProps {
  onSelectTool: (tool: Tool) => void;
  onGoHome: () => void;
  selectedToolId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectTool, onGoHome, selectedToolId }) => {
  const groupedTools = TOOLS.reduce((acc, tool) => {
    (acc[tool.category] = acc[tool.category] || []).push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <nav className="hidden w-64 flex-shrink-0 border-r border-red-950 bg-red-900 text-white md:block">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex h-16 flex-shrink-0 items-center border-b border-red-800 px-4">
          <MasAiLogo className="h-8 w-auto" />
          <span className="ml-3 text-xl font-semibold">MAS AI</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-4">
            <li>
              <button
                onClick={onGoHome}
                className={`group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium ${
                  !selectedToolId
                    ? 'bg-red-700 text-white'
                    : 'text-red-100 hover:bg-red-800 hover:text-white'
                }`}
              >
                <HomeIcon className="mr-3 h-5 w-5 flex-shrink-0 text-red-300 group-hover:text-red-100" />
                Home
              </button>
            </li>
          </ul>

          {Object.entries(groupedTools).map(([category, tools]) => (
            <div key={category} className="px-4">
              <h3 className="mb-2 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-red-300">
                {category}
              </h3>
              <ul className="space-y-1">
                {tools.map(tool => (
                  <li key={tool.id}>
                    <button
                      onClick={() => onSelectTool(tool)}
                      className={`group flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium ${
                        selectedToolId === tool.id
                          ? 'bg-red-700 text-white'
                          : 'text-red-100 hover:bg-red-800 hover:text-white'
                      }`}
                    >
                      <tool.icon className="mr-3 h-5 w-5 flex-shrink-0 text-red-300 group-hover:text-red-100" />
                      {tool.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;