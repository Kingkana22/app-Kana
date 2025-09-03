import React, { useState, useCallback } from 'react';
import { getCreativeResponse } from '../services/geminiService';
import { FiEdit, FiLoader } from 'react-icons/fi';

const CreateModule: React.FC<{ isMemoryLoading: boolean }> = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await getCreativeResponse(prompt);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult("Sorry, I couldn't generate a creative response right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Create</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Bring your ideas to life. Write a prompt and let KAI do the rest.</p>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-8 overflow-hidden">
        {/* Input Panel */}
        <div className="md:w-1/3 flex flex-col">
          <label htmlFor="creative-prompt" className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Your Prompt</label>
          <textarea
            id="creative-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A short story about a robot who discovers music..."
            className="flex-grow w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-all transform hover:scale-105 shadow-lg"
          >
            {isLoading ? <><FiLoader className="animate-spin" /> Generating...</> : <><FiEdit /> Generate</>}
          </button>
        </div>

        {/* Output Panel */}
        <div className="md:w-2/3 flex flex-col overflow-hidden">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Result</label>
            <div className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 overflow-y-auto">
              {isLoading && !result && (
                  <div className="flex items-center justify-center h-full text-gray-500">
                      <FiLoader className="animate-spin mr-4" size={24} />
                      KAI is thinking...
                  </div>
              )}
              {result && (
                <div 
                    className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }}
                />
              )}
               {!isLoading && !result && (
                  <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                     Your generated text will appear here.
                  </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModule;
