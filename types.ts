import type React from 'react';

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  promptTemplate: string;
  category: string;
  outputType: 'text' | 'image' | 'video';
}
