
import React, { useState, useCallback, useEffect } from 'react';
import type { Tool } from '../types';
import { generateContent, generateImage, generateVideo } from '../services/geminiService';
import { GRADE_LEVELS } from '../constants';
import { NGSS_STANDARDS } from '../utils/ngssStandards';
import FileUpload from './FileUpload';
import OutputDisplay from './OutputDisplay';
import { SparklesIcon, ClipboardIcon, ChevronDownIcon } from './icons';
import * as exportUtils from '../utils/exportUtils';


const ToolView: React.FC<{ tool: Tool }> = ({ tool }) => {
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [gradeLevel, setGradeLevel] = useState<string>(GRADE_LEVELS[6]);
  const [ngssStandard, setNgssStandard] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  useEffect(() => {
    // Reset state when tool changes
    setInputs({});
    setGradeLevel(GRADE_LEVELS[6]);
    setNgssStandard('');
    setFileContent('');
    setFileName('');
    setOutput('');
    setIsLoading(false);
    setError('');
    setShowExportMenu(false);
  }, [tool]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleFileRead = useCallback((content: string, name: string) => {
    setFileContent(content);
    setFileName(name);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOutput('');
    setError('');

    const allInputs = { ...inputs, gradeLevel, ngssStandard };
    const prompt = tool.promptTemplate(allInputs, fileContent);

    try {
      let result: string;
      switch (tool.outputType) {
        case 'image':
          result = await generateImage(prompt);
          break;
        case 'video':
          result = await generateVideo(prompt);
          break;
        case 'text':
        default:
          result = await generateContent(prompt);
          break;
      }
      setOutput(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  const isFormValid = () => {
    return tool.inputs.every(input => inputs[input.id] && inputs[input.id].trim() !== '');
  }

  const renderInput = (input: Tool['inputs'][0]) => {
    switch (input.type) {
      case 'textarea':
        return (
          <textarea
            id={input.id}
            name={input.id}
            value={inputs[input.id] || ''}
            onChange={handleInputChange}
            placeholder={input.placeholder}
            rows={4}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
      case 'select':
        return (
          <select
            id={input.id}
            name={input.id}
            value={inputs[input.id] || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">{input.placeholder || 'Select an option'}</option>
            {input.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'text':
      default:
        return (
          <input
            type="text"
            id={input.id}
            name={input.id}
            value={inputs[input.id] || ''}
            onChange={handleInputChange}
            placeholder={input.placeholder}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
    }
  };

  return (
    <div className="flex h-full flex-col gap-8 lg:flex-row">
      <div className="w-full lg:w-1/3 lg:max-w-md">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-sm text-slate-600">{tool.description}</p>
            {tool.inputs.map(input => (
              <div key={input.id}>
                <label htmlFor={input.id} className="block text-sm font-medium text-slate-700">
                  {input.label}
                </label>
                {renderInput(input)}
              </div>
            ))}

            {tool.requiresGradeLevel && (
              <div>
                <label htmlFor="gradeLevel" className="block text-sm font-medium text-slate-700">
                  Grade Level
                </label>
                <select
                  id="gradeLevel"
                  name="gradeLevel"
                  value={gradeLevel}
                  onChange={e => setGradeLevel(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {GRADE_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            )}
            
            {tool.requiresNGSS && (
              <div>
                <label htmlFor="ngssStandard" className="block text-sm font-medium text-slate-700">
                  NGSS Standard (Optional)
                </label>
                <select
                  id="ngssStandard"
                  name="ngssStandard"
                  value={ngssStandard}
                  onChange={e => setNgssStandard(e.target.value)}
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a standard</option>
                  {NGSS_STANDARDS.map(standard => (
                    <option key={standard.id} value={standard.name}>{standard.name}</option>
                  ))}
                </select>
              </div>
            )}

            {tool.showFileUpload && (
              <div>
                <FileUpload onFileRead={handleFileRead} />
                {fileName && (
                    <div className="mt-2 text-sm text-slate-600">
                        File added: <span className="font-medium">{fileName}</span>
                    </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
            >
              <SparklesIcon className="-ml-1 mr-3 h-5 w-5" />
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-slate-800">Output</h2>
                {!isLoading && output && (
                    <div className="flex items-center space-x-2">
                         <button onClick={handleCopy} className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600">
                            <ClipboardIcon className="h-4 w-4 mr-1"/>
                            {copySuccess ? 'Copied!' : 'Copy'}
                         </button>
                         <div className="relative">
                            <button
                                onClick={() => setShowExportMenu(!showExportMenu)}
                                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Export
                                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
                            </button>
                            {showExportMenu && (
                                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <button onClick={() => { exportUtils.exportAsMarkdown(output, tool.title); setShowExportMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Markdown (.md)</button>
                                        <button onClick={() => { exportUtils.exportAsPdf(output, tool.title); setShowExportMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">PDF (.pdf)</button>
                                        <button onClick={() => { exportUtils.exportAsDocx(output, tool.title); setShowExportMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Word (.docx)</button>
                                        {exportUtils.markdownHasTable(output) && (
                                            <>
                                            <div className="border-t border-slate-200 my-1"></div>
                                            <button onClick={() => { exportUtils.exportAsSpreadsheet(output, tool.title, 'xlsx'); setShowExportMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Excel (.xlsx)</button>
                                            <button onClick={() => { exportUtils.exportAsSpreadsheet(output, tool.title, 'csv'); setShowExportMenu(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">CSV (.csv)</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                         </div>
                    </div>
                )}
            </div>
            <div className="flex-grow">
                <OutputDisplay content={output} isLoading={isLoading} outputType={tool.outputType} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ToolView;
