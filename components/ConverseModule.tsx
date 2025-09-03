import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getConverseResponse } from '../services/geminiService';
import { FiSend, FiUploadCloud, FiMic, FiMicOff, FiCpu, FiArchive, FiCopy } from 'react-icons/fi';

interface ConverseModuleProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onCommitToMemory: (message: string) => void;
  isMemoryLoading: boolean;
}

// Helper for rendering markdown-like text
const renderText = (text: string) => {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<TextChunk key={lastIndex} text={text.substring(lastIndex, match.index)} />);
    }
    parts.push(<CodeBlock key={match.index} language={match[1] || ''} code={match[2]} />);
    lastIndex = codeBlockRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<TextChunk key={lastIndex} text={text.substring(lastIndex)} />);
  }
  
  return <>{parts}</>;
};

const TextChunk: React.FC<{ text: string }> = ({ text }) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const listRegex = /((?:(?:^|\n)\s*[-*]\s+.*)+)/g;
    
    const processedText = text
        .replace(boldRegex, '<strong>$1</strong>')
        .replace(listRegex, (match) => {
            const listItems = match.trim().split('\n')
                .map(item => `<li>${item.replace(/^\s*[-*]\s+/, '')}</li>`)
                .join('');
            return `<ul class="list-disc pl-5">${listItems}</ul>`;
        })
        .replace(/\n/g, '<br />');

    return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: processedText }} />;
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-gray-900 dark:bg-black/50 rounded-lg my-2 font-mono text-sm">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 dark:bg-black/25 rounded-t-lg">
        <span className="text-gray-400 text-xs">{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors">
          <FiCopy size={12} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-white"><code>{code}</code></pre>
    </div>
  );
};


const ConverseModule: React.FC<ConverseModuleProps> = ({ chatHistory, setChatHistory, onCommitToMemory, isMemoryLoading }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);
  
  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) setInput(prev => prev + finalTranscript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: trimmedInput, id: Date.now() };
    const newHistory = [...chatHistory, userMessage];
    setChatHistory(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getConverseResponse(newHistory);
      const aiMessage: ChatMessage = { sender: 'ai', text: aiResponse, id: Date.now() + 1 };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { sender: 'system', text: 'An error occurred. Please try again.', id: Date.now() + 1 };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, chatHistory, setChatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // ... (Other handlers: file, voice, etc. - simplified for brevity)
  const handleVoiceListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInput(prev => `${prev}\n\n--- Content of ${file.name} ---\n${event.target?.result}`);
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto px-4 py-6 md:py-10">
      <div className="flex-grow overflow-y-auto pr-4 space-y-8 pb-4">
        {chatHistory.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                <FiCpu size={16} />
              </div>
            )}
             {msg.sender === 'system' && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 w-full py-2 italic">{msg.text}</p>
            )}
            {msg.sender === 'ai' && (
                <div className="group relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm w-full">
                    {renderText(msg.text)}
                    <button 
                        onClick={() => onCommitToMemory(msg.text)} 
                        disabled={isMemoryLoading}
                        className="absolute -bottom-3 -right-3 p-1.5 rounded-full bg-indigo-500 text-white shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Commit to memory"
                    >
                        <FiArchive size={14} />
                    </button>
                </div>
            )}
            {msg.sender === 'user' && (
              <div className="bg-indigo-600 text-white p-4 rounded-lg shadow-sm">
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 mt-1"><FiCpu size={16} /></div>
            <div className="flex items-center gap-2 pt-3">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <div className="relative flex-grow">
            <textarea
              ref={textAreaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }}}
              placeholder="Ask KAI anything..."
              disabled={isLoading}
              className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg p-4 pr-24 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-y-hidden shadow-sm"
              rows={1}
              style={{ maxHeight: '200px' }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-indigo-600" aria-label="Upload file"><FiUploadCloud size={20}/></button>
              {recognitionRef.current && (
                <button type="button" onClick={handleVoiceListen} className={`p-2 ${isListening ? 'text-red-500' : 'text-gray-500'} hover:text-indigo-600`} aria-label="Use voice">
                  {isListening ? <FiMicOff size={20}/> : <FiMic size={20}/>}
                </button>
              )}
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="text/*" />
          <button type="submit" disabled={isLoading || !input.trim()} className="w-14 h-14 flex-shrink-0 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center shadow-lg ripple transform hover:scale-105 transition-all" aria-label="Send message"><FiSend size={24} /></button>
        </form>
      </div>
    </div>
  );
};

export default ConverseModule;
