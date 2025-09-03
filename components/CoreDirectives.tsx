import React, { useState, useEffect } from 'react';

interface CoreDirectivesProps {
  text: string;
}

const CoreDirectives: React.FC<CoreDirectivesProps> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 5);
    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50 p-3 rounded-lg h-40 overflow-y-auto font-mono">
      <p className="whitespace-pre-wrap">
        {displayedText}
        <span className="inline-block w-2 h-4 bg-gray-600 dark:bg-gray-400 animate-pulse ml-1"></span>
      </p>
    </div>
  );
};

export default CoreDirectives;