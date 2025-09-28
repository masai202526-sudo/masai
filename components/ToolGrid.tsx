import React from 'react';
import ToolCard from './ToolCard';
import type { Tool } from '../types';

interface ToolGridProps {
  tools: Tool[];
  onSelectTool: (tool: Tool) => void;
}

const ToolGrid: React.FC<ToolGridProps> = ({ tools, onSelectTool }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} onSelect={() => onSelectTool(tool)} />
      ))}
    </div>
  );
};

export default ToolGrid;
