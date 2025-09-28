import type { FC } from 'react';

export type ToolCategory = 'Planning' | 'Content' | 'Student Support' | 'Communication' | 'Productivity' | 'Media';

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: FC<{ className?: string }>;
  outputType: 'text' | 'image' | 'video';
  promptTemplate: (inputs: { [key: string]: string }, context?: string) => string;
  inputs: {
    id: string;
    label: string;
    type: 'textarea' | 'text' | 'select';
    placeholder?: string;
    options?: string[];
  }[];
  showFileUpload: boolean;
  requiresGradeLevel?: boolean;
  requiresNGSS?: boolean;
}
