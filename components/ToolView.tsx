import React, { useState, useCallback } from 'react';
import type { Tool } from '../types';
import FileUpload from './FileUpload';
import OutputDisplay from './OutputDisplay';
import { generateContent, generateImage, generateVideo } from '../services/geminiService';
import { exportAsMarkdown, exportAsPdf, exportAsDocx, exportAsSpreadsheet, markdownHasTable } from '../utils/exportUtils';


interface ToolViewProps {
  tool: Tool;
}

const ToolView: React.FC<ToolViewProps> = ({ tool }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Generating...');
  const [error, setError] = useState('');

  // State for tool-specific fields
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [gradeLevel, setGradeLevel] = useState('8th Grade');
  const [numQuestions, setNumQuestions] = useState('5');
  const [studentName, setStudentName] = useState('');
  const [recommendationRecipient, setRecommendationRecipient] = useState('');
  
  const handleFileRead = useCallback((content: string, name: string) => {
    setInput(content);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');
    setOutput('');

    const contextContent = input;
    if (!contextContent && !['jokes-generator', 'image-generator', 'video-generator'].includes(tool.id)) {
        setError('Please provide some input or upload a file.');
        setIsLoading(false);
        return;
    }

    let prompt = tool.promptTemplate.replace('{{CONTEXT}}', contextContent);
    
    // Handle tool-specific placeholders
    if(tool.outputType === 'text') {
      switch (tool.id) {
        case 'translate':
          prompt = prompt.replace('{{TARGET_LANGUAGE}}', targetLanguage);
          break;
        case 'text-leveler':
          prompt = prompt.replace('{{GRADE_LEVEL}}', gradeLevel);
          break;
        case 'multiple-choice-quiz':
          prompt = prompt.replace('{{NUM_QUESTIONS}}', numQuestions);
          break;
        case 'letter-of-recommendation':
          if (!studentName || !recommendationRecipient) {
            setError('Please fill in all required fields for the recommendation.');
            setIsLoading(false);
            return;
          }
          prompt = prompt.replace('{{STUDENT_NAME}}', studentName);
          prompt = prompt.replace('{{RECOMMENDATION_RECIPIENT}}', recommendationRecipient);
          break;
      }
    }
    
    try {
      let result = '';
      switch (tool.outputType) {
        case 'image':
          setLoadingMessage('Generating image...');
          result = await generateImage(prompt);
          break;
        case 'video':
          setLoadingMessage('Generating video... This may take a few minutes.');
          result = await generateVideo(prompt);
          break;
        case 'text':
        default:
          setLoadingMessage('Generating...');
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
  
  const showTableExports = tool.outputType === 'text' && markdownHasTable(output);

  const renderToolSpecificFields = () => {
    if (tool.outputType !== 'text') return null;
    switch (tool.id) {
      case 'translate':
        return (
          <div>
            <label htmlFor="target-language" className="block text-sm font-medium text-slate-700">
              Target Language
            </label>
            <input
              id="target-language"
              type="text"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        );
      case 'text-leveler':
        return (
           <div>
            <label htmlFor="grade-level" className="block text-sm font-medium text-slate-700">
              Target Grade Level
            </label>
            <select
              id="grade-level"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {[...Array(13).keys()].map(i => {
                const grade = i === 0 ? 'Kindergarten' : `${i}${i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th'} Grade`;
                return <option key={grade} value={grade}>{grade}</option>
              })}
               <option value="College">College</option>
            </select>
          </div>
        );
      case 'multiple-choice-quiz':
        return (
           <div>
            <label htmlFor="num-questions" className="block text-sm font-medium text-slate-700">
              Number of Questions
            </label>
            <input
              id="num-questions"
              type="number"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        );
      case 'letter-of-recommendation':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="student-name" className="block text-sm font-medium text-slate-700">
                Student's Full Name
              </label>
              <input
                id="student-name"
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
             <div>
              <label htmlFor="recipient" className="block text-sm font-medium text-slate-700">
                Applying For (e.g., "XYZ University", "ABC Scholarship")
              </label>
              <input
                id="recipient"
                type="text"
                required
                value={recommendationRecipient}
                onChange={(e) => setRecommendationRecipient(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  }
  
  const placeholderText = {
    'image-generator': 'Describe the image you want to create. E.g., "A photorealistic image of a robot teaching a class of dogs".',
    'video-generator': 'Describe the video you want to create. E.g., "A cinematic shot of a Monarch butterfly landing on a flower".',
    'summarize': 'Paste text to summarize, or upload a file below.',
    'code-explainer': 'Paste your code here...',
    'translate': 'Enter text to translate...',
    'lesson-plan-generator': 'Enter the topic, subject, or learning objective for your lesson. E.g., "Photosynthesis for 9th grade biology".',
    'rubric-generator': 'Describe the assignment for which you need a rubric. E.g., "A 5-paragraph essay on the causes of World War I".',
    'youtube-summarizer': 'Paste the full transcript of the YouTube video here.',
    'text-leveler': 'Paste the text you want to adapt for a different reading level.',
    'student-feedback': 'Paste the student\'s work here to get constructive feedback.',
    'class-newsletter': 'List the key points, dates, and announcements you want to include in your newsletter.',
    'letter-of-recommendation': 'Describe the student\'s strengths, skills, and any specific stories or achievements you want to highlight.',
    'jokes-generator': 'Enter a topic for the jokes, e.g., "math", "science", "dinosaurs".'
  }[tool.id] || 'Type or paste your text here...';


  return (
    <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-slate-600">{tool.description}</p>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Input Column */}
            <div className="space-y-6 lg:col-span-1">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md border border-slate-200 bg-white p-4">
                        
                        <div>
                            <label htmlFor="main-input" className="block text-sm font-medium text-slate-700">
                                {tool.id === 'letter-of-recommendation' ? 'Key Qualities & Anecdotes' : 'Prompt'}
                            </label>
                            <textarea
                                id="main-input"
                                rows={tool.outputType === 'text' ? 10 : 5}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                placeholder={placeholderText}
                            />
                        </div>
                        
                        {tool.outputType === 'text' && (
                             <FileUpload onFileRead={handleFileRead} />
                        )}

                       {renderToolSpecificFields()}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400"
                        >
                            {isLoading ? loadingMessage : 'Generate'}
                        </button>
                    </div>
                     {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </form>
            </div>

            {/* Output Column */}
            <div className="flex flex-col lg:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-slate-900">Output</h2>
                    {output && !isLoading && tool.outputType === 'text' && (
                        <div className="flex space-x-2">
                            <button onClick={() => exportAsMarkdown(output, tool.title)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">MD</button>
                            <button onClick={() => exportAsPdf(output, tool.title)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">PDF</button>
                            <button onClick={() => exportAsDocx(output, tool.title)} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">DOCX</button>
                            {showTableExports && (
                                <>
                                <button onClick={() => exportAsSpreadsheet(output, tool.title, 'xlsx')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">XLSX</button>
                                <button onClick={() => exportAsSpreadsheet(output, tool.title, 'csv')} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">CSV</button>
                                </>
                            )}
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
