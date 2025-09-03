import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AIMode, UserSelectableTool, AITool } from '../types';
import { FiSend, FiCpu, FiCheckCircle, FiGitCommit, FiCode, FiAlertTriangle, FiSearch, FiTrendingUp, FiDollarSign, FiBriefcase, FiLink, FiUploadCloud, FiBookOpen, FiMic, FiMicOff, FiThumbsUp, FiThumbsDown, FiCopy } from 'react-icons/fi';
import { FaBrain, FaWrench, FaBuilding } from 'react-icons/fa';

const ALL_MODES: AIMode[] = ['Safe', 'Edge', 'Hacker'];
const ALL_TOOLS: UserSelectableTool[] = ['Auto-Select', 'Strategic Planner', 'Google Search', 'Code Interpreter', 'Debugger', 'Marketing Analyst', 'Sales Strategist', 'Trading Bot', 'None'];

interface ChatInterfaceProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string, overrides: { mode?: AIMode, tool?: UserSelectableTool }) => void;
  onFeedback: (messageIndex: number, feedback: 'good' | 'bad') => void;
  error: string | null;
  prefilledPrompt?: string;
  onPromptUsed?: () => void;
  currentMode: AIMode;
}

interface AIMessageProps {
    msg: ChatMessage;
    isLastMessage: boolean;
    onFeedback: (feedback: 'good' | 'bad') => void;
}

const AIMessage: React.FC<AIMessageProps> = ({ msg, isLastMessage, onFeedback }) => {
    
    const renderTextWithMarkdown = (text: string) => {
      const processedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Find blocks of list items and wrap them in <ul>
        .replace(/((?:(?:^|\n)\s*[-*]\s+.*)+)/g, (match) => {
            const listItems = match.trim().split('\n')
                .map(item => `<li>${item.replace(/^\s*[-*]\s+/, '')}</li>`)
                .join('');
            return `<ul class="list-disc pl-5">${listItems}</ul>`;
        })
        .replace(/\n/g, '<br />')
        .replace(/<br \/>\s*<ul>/g, '<ul>')
        .replace(/<\/ul>\s*<br \/>/g, '</ul>');
    
      return <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: processedText }} />;
    }

    const PlanList: React.FC<{ items: string[] }> = ({ items }) => (
        <ol className="space-y-2 mt-2 list-decimal list-inside">
            {items.map((item, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300">
                    {item}
                </li>
            ))}
        </ol>
    );

    const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
        const [copied, setCopied] = useState(false);
        const codeLang = code.match(/```(\w+)/)?.[1] || '';
        const cleanCode = code.replace(/```(?:\w+)?\n/g, '').replace(/```\n?$/g, '');
        const handleCopy = () => {
            navigator.clipboard.writeText(cleanCode);
            setCopied(true); setTimeout(() => setCopied(false), 2000);
        };
        return (
            <div className="bg-gray-900 dark:bg-black/50 rounded-lg text-white font-mono text-sm">
                <div className="flex justify-between items-center px-4 py-2 bg-gray-800 dark:bg-black/25 rounded-t-lg">
                    <span className="text-gray-400 text-xs">{codeLang || 'code'}</span>
                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors disabled:opacity-50">
                        <FiCopy size={12} />
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <pre className="p-4 overflow-x-auto"><code>{cleanCode}</code></pre>
            </div>
        )
    };
    
    const ToolDisplay: React.FC<{ tool: AITool }> = ({ tool }) => {
        let icon;
        switch(tool) {
            case 'Strategic Planner': icon = <FaBuilding className="mr-2" />; break;
            case 'Code Interpreter': icon = <FiCode className="mr-2" />; break;
            case 'Debugger': icon = <FaWrench className="mr-2" />; break;
            case 'Google Search': icon = <FiSearch className="mr-2" />; break;
            case 'Marketing Analyst': icon = <FiTrendingUp className="mr-2" />; break;
            case 'Sales Strategist': icon = <FiDollarSign className="mr-2" />; break;
            case 'Trading Bot': icon = <FiBriefcase className="mr-2" />; break;
            default: icon = <FaBrain className="mr-2" />;
        }
        return (
             <div className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                {icon}
                <span>OPERATION: {tool.toUpperCase()}</span>
            </div>
        )
    };

    const Sources: React.FC<{ chunks: {uri: string, title: string}[] }> = ({ chunks }) => (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Sources:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {chunks.map((chunk, i) => (
                    <a href={chunk.uri} target="_blank" rel="noopener noreferrer" key={i} className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 p-2 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900 truncate">
                        <FiLink className="inline mr-1" />
                        {chunk.title || new URL(chunk.uri).hostname}
                    </a>
                ))}
            </div>
        </div>
    );

    if (msg.type === 'correction') {
        return (
            <div className="bg-yellow-50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg max-w-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center font-bold text-sm mb-2">
                    <FiAlertTriangle className="mr-2" /> <span>Self-Correction Subroutine</span>
                </div>
                <div>{renderTextWithMarkdown(msg.text)}</div>
            </div>
        );
    }

    if (msg.type === 'meta') {
        return (
            <div className="bg-purple-50 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 p-3 rounded-lg max-w-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center font-bold text-sm mb-2">
                    <FiBookOpen className="mr-2" /> <span>Self-Awareness Update</span>
                </div>
                <div className="italic">{renderTextWithMarkdown(msg.text)}</div>
            </div>
        );
    }
    
    const hasThoughtProcess = (msg.tool_used && msg.tool_used !== 'None') || msg.reasoning || (msg.plan && msg.plan.length > 0);
    const hasFeedback = msg.feedback === 'good' || msg.feedback === 'bad';

    return (
        <div className="group bg-slate-100 dark:bg-slate-700/50 text-gray-800 dark:text-gray-200 rounded-lg max-w-lg w-full border border-slate-200 dark:border-slate-700">
            <div className="p-4 space-y-4">
                {hasThoughtProcess && (
                    <details className="group" open={isLastMessage}>
                        <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 list-none -m-1 p-1 rounded-md transition-colors">
                            <FiCpu size={16} />
                            <span>AI Cognitive Process</span>
                            <svg className="w-4 h-4 ml-auto transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-600 space-y-3">
                            {msg.tool_used && msg.tool_used !== 'None' && <ToolDisplay tool={msg.tool_used} />}
                            {msg.reasoning && (
                                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <FiGitCommit className="mt-1 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                                    <div>
                                        <p className="font-semibold text-gray-700 dark:text-gray-200">Reasoning</p>
                                        <p>{msg.reasoning}</p>
                                    </div>
                                </div>
                            )}
                            {msg.plan && msg.plan.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Action Plan:</p>
                                    <PlanList items={msg.plan} />
                                </div>
                            )}
                        </div>
                    </details>
                )}

                {msg.text && (
                    <div>{renderTextWithMarkdown(msg.text)}</div>
                )}
                
                {msg.code && <CodeBlock code={msg.code} />}

                {msg.revenue_generated && msg.revenue_generated > 0 && (
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800 flex items-center text-green-700 dark:text-green-400 font-bold">
                        <FiDollarSign className="mr-2" />
                        <span>Revenue Generated: ${msg.revenue_generated.toLocaleString()}k</span>
                    </div>
                )}

                {msg.groundingChunks && msg.groundingChunks.length > 0 && <Sources chunks={msg.groundingChunks} />}
            </div>
             <div className="h-6 flex justify-end items-center px-2">
                <div className={`flex items-center gap-1 transition-opacity duration-200 ${hasFeedback ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`}>
                    <button 
                        onClick={() => onFeedback('good')} 
                        disabled={hasFeedback}
                        className={`p-1.5 rounded-full text-gray-500 dark:text-gray-400 disabled:cursor-not-allowed ${msg.feedback === 'good' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        aria-label="Good response"
                    >
                        <FiThumbsUp size={14} />
                    </button>
                    <button 
                        onClick={() => onFeedback('bad')} 
                        disabled={hasFeedback}
                        className={`p-1.5 rounded-full text-gray-500 dark:text-gray-400 disabled:cursor-not-allowed ${msg.feedback === 'bad' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        aria-label="Bad response"
                    >
                        <FiThumbsDown size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatHistory, isLoading, onSendMessage, onFeedback, error, prefilledPrompt, onPromptUsed, currentMode }) => {
  const [input, setInput] = useState('');
  const [overrideMode, setOverrideMode] = useState<AIMode>();
  const [overrideTool, setOverrideTool] = useState<UserSelectableTool>('Auto-Select');
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const dragCounter = useRef(0);


  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, isLoading]);
  useEffect(() => { setOverrideMode(currentMode); }, [currentMode]);

  useEffect(() => {
    if (prefilledPrompt && onPromptUsed) {
      setInput(prefilledPrompt);
      textAreaRef.current?.focus();
      onPromptUsed();
    }
  }, [prefilledPrompt, onPromptUsed]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [input]);
  
  // Setup Speech Recognition
  useEffect(() => {
    // Fix: Cast window to any to access non-standard SpeechRecognition API properties
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInput(input + finalTranscript);
      };
      recognitionRef.current = recognition;
    }
  }, [input]);

  const handleVoiceListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const processFile = (file: File) => {
    const validExtensions = ['.txt', '.js', '.py'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    if (validExtensions.includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        setInput(prev => `${prev}\n\n--- START OF UPLOADED FILE: ${file.name} ---\n${fileContent}\n--- END OF UPLOADED FILE ---`);
      };
      reader.readAsText(file);
    } else {
        console.warn(`File type not supported: ${file.name}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = ''; // Reset file input
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim(), { mode: overrideMode, tool: overrideTool });
      setInput('');
      setOverrideTool('Auto-Select');
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const Select: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: readonly string[]}> = ({label, value, onChange, options}) => (
    <div className="flex-1">
      <label className="text-xs text-gray-500 dark:text-gray-400">{label}</label>
      <select value={value} onChange={onChange} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-gray-200">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  return (
    <div className="flex flex-col h-full p-4 pb-20 md:pb-4">
      <div className="flex-grow overflow-y-auto pr-4 space-y-8">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
             {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0"><FiCpu size={16} /></div>}
             {msg.sender === 'user' && <div className="bg-indigo-600 text-white p-3 rounded-lg max-w-lg"><p className="whitespace-pre-wrap">{msg.text}</p></div>}
             {msg.sender === 'ai' && <AIMessage msg={msg} isLastMessage={index === chatHistory.length - 1 && !isLoading} onFeedback={(feedback) => onFeedback(index, feedback)} />}
             {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 flex-shrink-0"><span>U</span></div>}
             {msg.sender === 'system' && <p className="text-center text-sm text-gray-500 dark:text-gray-400 w-full py-2">{msg.text}</p>}
          </div>
        ))}
        {isLoading && chatHistory[chatHistory.length-1]?.sender !== 'ai' && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0"><FiCpu size={16} /></div>
             <div className="flex items-center gap-2 pt-3">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
            <Select label="Directive Override" value={overrideMode || ''} onChange={e => setOverrideMode(e.target.value as AIMode)} options={ALL_MODES} />
            <Select label="Tool Override" value={overrideTool} onChange={e => setOverrideTool(e.target.value as UserSelectableTool)} options={ALL_TOOLS} />
        </div>
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <div 
            className="relative flex-grow"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
             {isDragging && (
                <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-indigo-500 pointer-events-none">
                    <p className="font-bold text-indigo-600 dark:text-indigo-400">Drop text file to upload</p>
                </div>
            )}
            <textarea ref={textAreaRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }}} placeholder="Issue directive..." disabled={isLoading} className="w-full bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg p-3 pr-24 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-y-hidden" rows={1} style={{maxHeight: '200px'}} autoFocus />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" aria-label="Upload file"><FiUploadCloud size={20}/></button>
              {recognitionRef.current && (
                <button type="button" onClick={handleVoiceListen} className={`p-2 ${isListening ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} hover:text-indigo-600 dark:hover:text-indigo-400`} aria-label="Use voice">
                  {isListening ? <FiMicOff size={20}/> : <FiMic size={20}/>}
                </button>
              )}
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.js,.py"/>
          <button type="submit" disabled={isLoading || !input.trim()} className="w-12 h-12 flex-shrink-0 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 flex items-center justify-center shadow-lg ripple" aria-label="Send message"><FiSend size={20} /></button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ChatInterface;