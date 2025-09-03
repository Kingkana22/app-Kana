import React, { useState, useCallback } from 'react';
import { getAnalysisResponse } from '../services/geminiService';
import { FiClipboard, FiHelpCircle, FiLoader } from 'react-icons/fi';

const AnalyzeModule: React.FC<{ isMemoryLoading: boolean }> = () => {
  const [textToAnalyze, setTextToAnalyze] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!textToAnalyze.trim() || !question.trim() || isLoading) return;
    setIsLoading(true);
    setResult('');
    try {
      const response = await getAnalysisResponse(textToAnalyze, question);
      setResult(response);
    } catch (error) {
      console.error(error);
      setResult("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [textToAnalyze, question, isLoading]);

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Analyze</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Get insights from text. Provide content and ask a question.</p>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-8 overflow-hidden">
        {/* Input Panels */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="flex-grow flex flex-col">
            <label htmlFor="text-to-analyze" className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2"><FiClipboard /> Text to Analyze</label>
            <textarea
              id="text-to-analyze"
              value={textToAnalyze}
              onChange={(e) => setTextToAnalyze(e.target.value)}
              placeholder="Paste any text, article, or code snippet here..."
              className="flex-grow w-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="h-1/3 flex flex-col">
            <label htmlFor="question" className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2"><FiHelpCircle /> Your Question</label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Summarize the main points, explain this function, what is the sentiment?"
              className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="md:w-1/2 flex flex-col overflow-hidden">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Analysis</label>
          <div className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 overflow-y-auto">
             {isLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                      <FiLoader className="animate-spin mr-4" size={24} />
                      KAI is analyzing...
                  </div>
              ) : result ? (
                <div 
                    className="prose dark:prose-invert max-w-none whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>') }}
                />
              ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                     The analysis will appear here.
                  </div>
              )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <button
            onClick={handleAnalyze}
            disabled={isLoading || !textToAnalyze.trim() || !question.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-all transform hover:scale-105 shadow-lg"
          >
            {isLoading ? <><FiLoader className="animate-spin" /> Analyzing...</> : 'Run Analysis'}
        </button>
      </div>
    </div>
  );
};

export default AnalyzeModule;
