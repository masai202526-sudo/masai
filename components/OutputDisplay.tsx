import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Tool } from '../types';

interface OutputDisplayProps {
  content: string;
  isLoading: boolean;
  outputType: Tool['outputType'];
}

const LoadingSkeleton: FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
         <div className="h-4 bg-slate-200 rounded w-1/2 mt-6"></div>
         <div className="h-4 bg-slate-200 rounded w-full"></div>
         <div className="h-4 bg-slate-200 rounded w-3/4"></div>
    </div>
);


const OutputDisplay: React.FC<OutputDisplayProps> = ({ content, isLoading, outputType }) => {
    // We need to dynamically import these libraries as they are not part of the standard build.
    const [markdownLibs, setMarkdownLibs] = useState<{
        ReactMarkdown: typeof ReactMarkdown | null;
        remarkGfm: typeof remarkGfm | null;
    }>({ ReactMarkdown: null, remarkGfm: null });

    useEffect(() => {
      if (outputType === 'text') {
        Promise.all([
            import('react-markdown'),
            import('remark-gfm')
        ]).then(([reactMarkdownModule, remarkGfmModule]) => {
            setMarkdownLibs({
                ReactMarkdown: reactMarkdownModule.default,
                remarkGfm: remarkGfmModule.default
            });
        });
      }
    }, [outputType]);

    const { ReactMarkdown: MD, remarkGfm: GFM } = markdownLibs;

    const renderContent = () => {
        switch (outputType) {
            case 'image':
                return (
                    <div className="flex h-full w-full items-center justify-center">
                        <img src={content} alt="Generated image" className="max-h-full max-w-full rounded-lg object-contain" />
                    </div>
                );
            case 'video':
                 return (
                    <div className="flex h-full w-full items-center justify-center bg-black rounded-lg">
                        <video controls src={content} className="max-h-full max-w-full rounded-lg" />
                    </div>
                );
            case 'text':
            default:
                 if (!MD || !GFM) {
                    // Fallback for while markdown libraries are loading
                    return <div className="prose prose-slate max-w-none whitespace-pre-wrap">{content}</div>;
                }
                return (
                    // FIX: Wrap ReactMarkdown component in a div with prose classes to fix typing error and correctly apply styles.
                    <div className="prose prose-slate max-w-none">
                        <MD
                            remarkPlugins={[GFM]}
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-2xl font-bold" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-semibold border-b pb-2 mt-4" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4" {...props} />,
                                table: ({node, ...props}) => <table className="table-auto w-full my-4" {...props} />,
                                thead: ({node, ...props}) => <thead className="bg-slate-100" {...props} />,
                                th: ({node, ...props}) => <th className="px-4 py-2 text-left text-sm font-semibold text-slate-800" {...props} />,
                                tr: ({node, ...props}) => <tr className="even:bg-slate-50" {...props} />,
                                td: ({node, ...props}) => <td className="border-t border-slate-200 px-4 py-2 text-sm text-slate-700" {...props} />,
                            }}
                        >
                            {content}
                        </MD>
                    </div>
                );
        }
    }


    if (isLoading) {
        return (
             <div className="h-full w-full rounded-md border border-slate-200 bg-white p-4">
                <LoadingSkeleton />
            </div>
        )
    }

    if (!content && !isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-md border border-slate-200 bg-white p-4">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-slate-900">No content generated yet</h3>
                    <p className="mt-1 text-sm text-slate-500">Your results will appear here.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full w-full overflow-y-auto rounded-md border border-slate-200 bg-white p-4">
             {renderContent()}
        </div>
    );
};

export default OutputDisplay;
