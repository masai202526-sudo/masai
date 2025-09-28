import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ToolGrid from './components/ToolGrid';
import ToolView from './components/ToolView';
import { TOOLS } from './constants';
import type { Tool } from './types';

const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleGoHome = () => {
    setSelectedTool(null);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar onSelectTool={handleSelectTool} onGoHome={handleGoHome} selectedToolId={selectedTool?.id}/>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header tool={selectedTool} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {!selectedTool ? (
            <ToolGrid tools={TOOLS} onSelectTool={handleSelectTool} />
          ) : (
            <ToolView key={selectedTool.id} tool={selectedTool} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
