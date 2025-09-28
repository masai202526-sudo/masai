import React, { useCallback, useState } from 'react';
import { UploadCloudIcon } from './icons';

// Tell TypeScript about the pdfjsLib global from the script tag in index.html
declare const pdfjsLib: any;

interface FileUploadProps {
  onFileRead: (content: string, name: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileRead }) => {
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');

  const handleFile = async (file: File | null) => {
    if (!file) return;

    setParsing(true);
    setParseError('');

    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileRead(text, file.name);
        setParsing(false);
      };
      reader.onerror = () => {
        setParseError('Failed to read the text file.');
        setParsing(false);
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
      if (typeof pdfjsLib === 'undefined') {
        setParseError('PDF parsing library not loaded. Please refresh the page.');
        setParsing(false);
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        try {
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          const pagePromises = Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1));
          const pages = await Promise.all(pagePromises);
          const textContentPromises = pages.map(page => page.getTextContent());
          const textContents = await Promise.all(textContentPromises);
          const fullText = textContents.map(content =>
            content.items.map((item: any) => item.str).join(' ')
          ).join('\n\n');

          onFileRead(fullText, file.name);
        } catch (error) {
          console.error('Error parsing PDF:', error);
          setParseError('Failed to parse the PDF file. It might be corrupted or protected.');
        } finally {
          setParsing(false);
        }
      };
      reader.onerror = () => {
        setParseError('Failed to read the PDF file.');
        setParsing(false);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setParseError('Unsupported file type. Please upload a .txt or .pdf file.');
      setParsing(false);
    }
  };

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFile(file);
    // Reset input so user can upload the same file again
    event.target.value = '';
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0] || null;
    handleFile(file);
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Add Context (Optional)
      </label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="mt-1 flex justify-center rounded-md border-2 border-dashed border-slate-300 px-6 pt-5 pb-6"
      >
        <div className="space-y-1 text-center">
          {parsing ? (
            <>
              <div className="mx-auto flex h-12 w-12 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
              </div>
              <p className="text-sm text-slate-600">Parsing file...</p>
              <p className="text-xs text-slate-500">Please wait</p>
            </>
          ) : (
            <>
              <UploadCloudIcon className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleInputChange} accept=".txt,.pdf" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">TXT or PDF up to 5MB</p>
            </>
          )}
        </div>
      </div>
      {parseError && <p className="mt-2 text-sm text-red-600">{parseError}</p>}
    </div>
  );
};

export default FileUpload;