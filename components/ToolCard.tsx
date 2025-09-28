import React from 'react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onSelect: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600 transition-colors group-hover:bg-sky-200">
        <tool.icon className="h-6 w-6" />
      </div>
      <div className="mt-4 flex flex-grow flex-col">
        <h3 className="text-lg font-semibold text-slate-800">{tool.title}</h3>
        <p className="mt-1 flex-grow text-sm text-slate-500">{tool.description}</p>
      </div>
    </button>
  );
};

export default ToolCard;
