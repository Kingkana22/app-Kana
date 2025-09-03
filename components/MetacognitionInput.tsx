import React, { useState } from 'react';

interface MetacognitionInputProps {
  onProcessLog: (log: string) => void;
  isLoading: boolean;
}

const MetacognitionInput: React.FC<MetacognitionInputProps> = ({ onProcessLog, isLoading }) => {
  const [input, setInput] = useState('');
  const maxLength = 500;
  const isOverLimit = input.length > maxLength;
  const isInputEmpty = !input.trim();

  const handleSubmit = () => {
    if (!isInputEmpty && !isLoading && !isOverLimit) {
      onProcessLog(input.trim());
      setInput('');
    }
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Architect's Log: Describe recent changes to my architecture..."
        disabled={isLoading}
        className={`w-full p-2 border rounded-md text-sm resize-none bg-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 ${isOverLimit ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}`}
        rows={4}
      />
      <div className="flex justify-between items-start mt-2">
        <div className="flex-1 pt-1">
            <p className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {input.length}/{maxLength}
            </p>
            {isOverLimit && (
                <p className="text-xs text-red-500 mt-1">
                    Error: Input exceeds {maxLength} characters.
                </p>
            )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || isInputEmpty || isOverLimit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-all ml-2 flex-shrink-0"
        >
          Trigger AI Learning
        </button>
      </div>
    </div>
  );
};

export default MetacognitionInput;
