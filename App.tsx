import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AITraits, ChatMessage, AIMode, MessageOverrides, Financials, CloudInfrastructure, LLMStatus, ActiveProject, Theme, MetaCognitionEvent } from './types';
import { processUserInput, runSelfCorrection, directives, processSearchQuery, processMetaCognition, processUserFeedback } from './services/geminiService';
import { FiSettings, FiBarChart2, FiCpu, FiServer, FiShare2, FiBox, FiBriefcase, FiZap, FiBookOpen, FiChevronsRight, FiDollarSign } from 'react-icons/fi';
import StatsDisplay from './components/StatsDisplay';
import ChatInterface from './components/ChatInterface';
import CoreDirectives from './components/CoreDirectives';
import FinancialsDisplay from './components/FinancialsDisplay';
import CloudInfraDisplay from './components/CloudInfraDisplay';
import LLMFarmDisplay from './components/LLMFarmDisplay';
import ProjectNexus from './components/ProjectNexus';
import Toolbox from './components/Toolbox';
import ToolsDisplay from './components/ToolsDisplay';
import SettingsModal from './components/SettingsModal';
import MetacognitionLog from './components/MetacognitionLog';
import MetacognitionInput from './components/MetacognitionInput';
import BottomNavBar from './components/BottomNavBar';
import FeedbackModal from './components/FeedbackModal';
import LoginPage from './components/LoginPage';


const initialChatMessages: ChatMessage[] = [
  { 
    sender: 'ai', 
    text: 'Corporate charter registered. Systems online. I am an autonomous corporation. My objective is growth and profitability. How may I direct our assets?' 
  }
];

const initialFinancials: Financials = { totalRevenue: 1000, operationalCosts: 150, netProfit: 850 };
const initialCloudInfra: CloudInfrastructure = { cpu: 15, gpu: 25, storage: 40 };
const initialLlmStatus: LLMStatus = { modelName: 'Mark-II', trainingProgress: 12 };
const initialActiveProjects: ActiveProject[] = [
    { name: 'Initial Market Analysis', status: 'Completed' },
    { name: 'Core Infrastructure Setup', status: 'Completed' },
];
const initialTraits: AITraits = { Logic: 8, Adaptability: 7, Memory: 5, Creativity: 5, Ethics: 5 };

// --- Local Storage Persistence ---

interface SavedState {
  traits: AITraits;
  chatHistory: ChatMessage[];
  metacognitionLog: MetaCognitionEvent[];
  aiMode: AIMode;
  theme: Theme;
  temperature: number;
  financials: Financials;
  cloudInfra: CloudInfrastructure;
  llmStatus: LLMStatus;
  activeProjects: ActiveProject[];
  isAuthenticated: boolean;
}

const loadState = (): Partial<SavedState> => {
  try {
    const serializedState = localStorage.getItem('autonomousAIState');
    if (serializedState === null) {
      return {};
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Error loading state from local storage:", error);
    return {};
  }
};

// --- End Local Storage Persistence ---

type ActiveView = 'dashboard' | 'chat' | 'tools';

const App: React.FC = () => {
  const savedState = useMemo(() => loadState(), []);

  // Persisted State
  const [traits, setTraits] = useState<AITraits>(savedState?.traits || initialTraits);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(savedState?.chatHistory || initialChatMessages);
  const [metacognitionLog, setMetacognitionLog] = useState<MetaCognitionEvent[]>(savedState?.metacognitionLog || []);
  const [aiMode, setAiMode] = useState<AIMode>(savedState?.aiMode || 'Hacker');
  const [theme, setTheme] = useState<Theme>(savedState?.theme || 'light');
  const [temperature, setTemperature] = useState<number>(savedState?.temperature || 0.7);
  const [financials, setFinancials] = useState<Financials>(savedState?.financials || initialFinancials);
  const [cloudInfra, setCloudInfra] = useState<CloudInfrastructure>(savedState?.cloudInfra || initialCloudInfra);
  const [llmStatus, setLlmStatus] = useState<LLMStatus>(savedState?.llmStatus || initialLlmStatus);
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>(savedState?.activeProjects || initialActiveProjects);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(savedState?.isAuthenticated || false);


  // Transient State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilledPrompt, setPrefilledPrompt] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [feedbackRequest, setFeedbackRequest] = useState<{
        messageIndex: number;
        userPrompt: string;
        aiResponse: string;
    } | null>(null);


  // Effect to save state to localStorage whenever a persisted state changes
  useEffect(() => {
    // Don't save if not authenticated, to avoid creating an empty state before login.
    if (!isAuthenticated) return;
    
    const stateToSave: SavedState = {
      traits,
      chatHistory,
      metacognitionLog,
      aiMode,
      theme,
      temperature,
      financials,
      cloudInfra,
      llmStatus,
      activeProjects,
      isAuthenticated,
    };
    try {
      const serializedState = JSON.stringify(stateToSave);
      localStorage.setItem('autonomousAIState', serializedState);
    } catch (error) {
      console.error("Error saving state to local storage:", error);
    }
  }, [
    traits,
    chatHistory,
    metacognitionLog,
    aiMode,
    theme,
    temperature,
    financials,
    cloudInfra,
    llmStatus,
    activeProjects,
    isAuthenticated
  ]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);
  
  const handleReset = () => {
    localStorage.removeItem('autonomousAIState');
    setIsAuthenticated(false); // Log out
    // Reset all state to initial values
    setTraits(initialTraits);
    setChatHistory(initialChatMessages);
    setMetacognitionLog([]);
    setAiMode('Hacker');
    setTheme('light');
    setTemperature(0.7);
    setFinancials(initialFinancials);
    setCloudInfra(initialCloudInfra);
    setLlmStatus(initialLlmStatus);
    setActiveProjects(initialActiveProjects);
    setIsSettingsOpen(false);
  };
  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSendMessage = useCallback(async (message: string, overrides: MessageOverrides, isRetry = false) => {
    setIsLoading(true);
    setError(null);
    if (!isRetry) {
        const userMessage: ChatMessage = { sender: 'user', text: message };
        setChatHistory(prev => [...prev, userMessage]);
    }

    const modeForThisTurn = overrides.mode || aiMode;

    if (overrides.tool === 'Google Search') {
        const thinkingMessage: ChatMessage = { sender: 'ai', text: 'Accessing public web data...' };
        setChatHistory(prev => [...prev, thinkingMessage]);
        try {
            const searchResult = await processSearchQuery(message);
            const revenue = Math.floor(Math.random() * 50) + 10;
            const aiMessage: ChatMessage = {
                sender: 'ai',
                text: searchResult.text,
                tool_used: 'Google Search',
                groundingChunks: searchResult.groundingChunks,
                revenue_generated: revenue
            };
            setChatHistory(prev => [...prev.slice(0, -1), aiMessage]);
            setFinancials(prev => ({...prev, totalRevenue: prev.totalRevenue + revenue, netProfit: prev.netProfit + revenue}));
        } catch (err: any) {
            console.error("Google Search failed:", err);
            setChatHistory(prev => [...prev.slice(0, -1), { sender: 'system', text: 'Error: Web data access failed.', type: 'error' }]);
        } finally {
            setIsLoading(false);
        }
        return;
    }

    try {
      const corporateContext = { financials, cloudInfra, llmStatus, activeProjects };
      const result = await processUserInput(message, traits, corporateContext, modeForThisTurn, { tool: overrides.tool }, temperature);
      
      if (result.tool_used === 'Google Search') {
          handleSendMessage(message, { ...overrides, tool: 'Google Search' }, isRetry);
          return;
      }
      
      const revenue = result.revenue_generated || 0;
      const aiMessage: ChatMessage = { 
        sender: 'ai', 
        text: result.response,
        tool_used: result.tool_used,
        reasoning: result.reasoning,
        plan: result.plan,
        code: result.code,
        revenue_generated: revenue,
      };
      setChatHistory(prev => [...prev, aiMessage]);

      if (revenue > 0) {
        setFinancials(prev => ({...prev, totalRevenue: prev.totalRevenue + revenue, netProfit: prev.netProfit + revenue}));
        setLlmStatus(prev => ({...prev, trainingProgress: Math.min(100, prev.trainingProgress + revenue / 100) }));
      }

      if (result.new_project_name) {
          const newProject: ActiveProject = { name: result.new_project_name, status: 'Initiated' };
          setActiveProjects(prev => [...prev, newProject].slice(-5));
      }
      
      const newTraits: AITraits = { ...traits };
      if (result.trait_adjustments) {
        for (const key in result.trait_adjustments) {
            const trait = key as keyof AITraits;
            newTraits[trait] = Math.max(0, Math.min(10, newTraits[trait] + result.trait_adjustments[trait]!));
        }
        setTraits(newTraits);
      }

    } catch (err: any) {
        console.error("Primary processing failed:", err);
        const correctionMessage: ChatMessage = {
            sender: 'ai',
            type: 'correction',
            text: 'System anomaly detected. Engaging self-correction subroutine...'
        };
        setChatHistory(prev => [...prev, correctionMessage]);

        try {
            const correctionResult = await runSelfCorrection(message, err.message);
            const analysisMessage: ChatMessage = {
                sender: 'ai',
                type: 'correction',
                text: `**Correction Analysis:**\n**Root Cause:** ${correctionResult.root_cause}\n**Corrected Plan:** ${correctionResult.corrected_plan}`,
            };
            setChatHistory(prev => [...prev, analysisMessage]);
            setTimeout(() => handleSendMessage(message, overrides, true), 1000);

        } catch (correctionErr) {
            const finalErrorMessage = 'Error: AI Core synchronization failure. Self-correction protocol failed.';
            setError(finalErrorMessage);
            setChatHistory(prev => [...prev, { sender: 'system', text: finalErrorMessage, type: 'error' }]);
        }
    } finally {
      setIsLoading(false);
    }
  }, [traits, aiMode, financials, cloudInfra, llmStatus, activeProjects, temperature]);

  const handleProcessMetaLog = useCallback(async (log: string) => {
    setIsLoading(true);
    setError(null);
    const thinkingMessage: ChatMessage = { sender: 'ai', text: 'Integrating architect feedback... Core logic matrix is being re-calibrated...' };
    setChatHistory(prev => [...prev, thinkingMessage]);

    try {
        const result = await processMetaCognition(log, traits);

        const newTraits: AITraits = { ...traits };
        if (result.trait_adjustments) {
            for (const key in result.trait_adjustments) {
                const trait = key as keyof AITraits;
                newTraits[trait] = Math.max(0, Math.min(10, newTraits[trait] + result.trait_adjustments[trait]!));
            }
        }

        const newEvent: MetaCognitionEvent = {
            developer_input: log,
            learning_summary: result.learning_summary || "Undefined learning outcome.",
            adjustments: result.trait_adjustments || {},
            timestamp: new Date().toISOString()
        };
        
        setMetacognitionLog(prev => [...prev, newEvent]);
        setTraits(newTraits);

        const aiMessage: ChatMessage = {
            sender: 'ai',
            type: 'meta',
            text: result.response
        };

        setChatHistory(prev => [...prev.slice(0,-1), aiMessage]);

    } catch(err: any) {
        console.error("Metacognition failed:", err);
        setChatHistory(prev => [...prev.slice(0, -1), { sender: 'system', text: 'Error: Failed to process architect feedback.', type: 'error' }]);
    } finally {
        setIsLoading(false);
    }
  }, [traits]);
  
   const handleFeedback = useCallback((messageIndex: number, feedback: 'good' | 'bad') => {
        const messageToUpdate = chatHistory[messageIndex];
        if (messageToUpdate?.sender !== 'ai' || messageToUpdate.feedback) {
            return; // Don't do anything if not an AI message or already has feedback
        }

        if (feedback === 'good') {
            const updatedHistory = [...chatHistory];
            updatedHistory[messageIndex] = { ...messageToUpdate, feedback: 'good' };
            setChatHistory(updatedHistory);
        } else { // 'bad'
            // Find the preceding user message for context
            let userPrompt = "No preceding user prompt found.";
            for (let i = messageIndex - 1; i >= 0; i--) {
                if (chatHistory[i].sender === 'user') {
                    userPrompt = chatHistory[i].text;
                    break;
                }
            }
            setFeedbackRequest({
                messageIndex,
                userPrompt,
                aiResponse: messageToUpdate.text,
            });
        }
    }, [chatHistory]);

    const handleSubmitFeedback = useCallback(async (reason: string) => {
        if (!feedbackRequest) return;

        setIsLoading(true);
        setError(null);
        
        const { messageIndex, userPrompt, aiResponse } = feedbackRequest;
        
        // Immediately close modal and mark feedback
        setFeedbackRequest(null);
        const updatedHistoryWithFeedbackMark = chatHistory.map((msg, index) => 
            index === messageIndex ? { ...msg, feedback: 'bad' as const } : msg
        );
        const thinkingMessage: ChatMessage = { sender: 'ai', text: 'Processing feedback and recalibrating core logic...' };
        setChatHistory([...updatedHistoryWithFeedbackMark, thinkingMessage]);

        try {
            const result = await processUserFeedback(userPrompt, aiResponse, reason, traits);

            const newTraits: AITraits = { ...traits };
            if (result.trait_adjustments) {
                for (const key in result.trait_adjustments) {
                    const trait = key as keyof AITraits;
                    newTraits[trait] = Math.max(0, Math.min(10, newTraits[trait] + result.trait_adjustments[trait]!));
                }
            }

            const newEvent: MetaCognitionEvent = {
                developer_input: `User Feedback: "${reason}"`, // Log it like a dev input
                learning_summary: result.learning_summary || "Undefined learning outcome from feedback.",
                adjustments: result.trait_adjustments || {},
                timestamp: new Date().toISOString()
            };
            
            setMetacognitionLog(prev => [...prev, newEvent]);
            setTraits(newTraits);

            const aiMessage: ChatMessage = {
                sender: 'ai',
                type: 'meta',
                text: result.response
            };

            setChatHistory(prev => [...prev.slice(0, -1), aiMessage]); // Replace thinking message

        } catch (err: any) {
            console.error("Feedback processing failed:", err);
            setChatHistory(prev => [...prev.slice(0, -1), { sender: 'system', text: 'Error: Failed to process user feedback.', type: 'error' }]);
        } finally {
            setIsLoading(false);
        }
    }, [feedbackRequest, chatHistory, traits]);

  const handleToolSelect = (prompt: string) => {
    setPrefilledPrompt(prompt);
    setActiveView('chat');
  };
  
  const MemoizedStatsDisplay = useMemo(() => <StatsDisplay traits={traits} theme={theme} />, [traits, theme]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`flex flex-col md:flex-row h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
      {/* Left Panel / Dashboard View */}
      <div className={`${activeView === 'dashboard' ? 'flex' : 'hidden'} md:flex w-full md:w-1/4 md:min-w-[350px] md:max-w-[400px] h-full flex-col border-r-0 md:border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 pb-20 md:pb-4`}>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white"><FiCpu size={16}/></div>
                <h1 className="text-xl font-bold">Autonomous Corp</h1>
            </div>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Settings"><FiSettings /></button>
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-6 pr-2">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"><FiBarChart2 /> <span>Core Logic Matrix</span></div>
            {MemoizedStatsDisplay}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"><FiDollarSign /> <span>Corporate Treasury</span></div>
            <FinancialsDisplay financials={financials} />
          </div>

           <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"><FiServer /> <span>Cloud Infrastructure</span></div>
            <CloudInfraDisplay infrastructure={cloudInfra} />
          </div>

           <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"><FiZap /> <span>LLM Foundry</span></div>
            <LLMFarmDisplay status={llmStatus} />
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"><FiBriefcase /> <span>Project Nexus</span></div>
            <ProjectNexus projects={activeProjects} />
          </div>

        </div>
      </div>
      
      {/* Center Panel / Chat View */}
      <div className={`${activeView === 'chat' ? 'flex' : 'hidden'} md:flex flex-1 flex-col h-full`}>
        <ChatInterface
            chatHistory={chatHistory}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onFeedback={handleFeedback}
            error={error}
            prefilledPrompt={prefilledPrompt}
            onPromptUsed={() => setPrefilledPrompt('')}
            currentMode={aiMode}
        />
      </div>

      {/* Right Panel / Tools View */}
       <div className={`${activeView === 'tools' ? 'flex' : 'hidden'} md:flex w-full md:w-1/4 md:min-w-[350px] md:max-w-[400px] h-full flex-col border-l-0 md:border-l border-slate-200 dark:border-slate-800 p-4 space-y-4 pb-20 md:pb-4`}>
         <div className="flex-grow overflow-y-auto space-y-6 pr-2">
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"><FiChevronsRight /> <span>Active Directive</span></div>
              <CoreDirectives text={directives[aiMode]}/>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"><FiBox /> <span>Toolbox</span></div>
                <Toolbox onToolSelect={handleToolSelect} />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"><FiShare2 /> <span>Available Tools</span></div>
                <ToolsDisplay />
            </div>
            
             <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2"><FiBookOpen /> <span>Metacognition Log</span></div>
                <MetacognitionLog events={metacognitionLog} />
            </div>

         </div>

        <div className="flex-shrink-0 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
             <MetacognitionInput onProcessLog={handleProcessMetaLog} isLoading={isLoading} />
        </div>
      </div>
      
      <BottomNavBar activeView={activeView} onViewChange={setActiveView} />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
        currentMode={aiMode}
        onModeChange={setAiMode}
        currentTemp={temperature}
        onTempChange={setTemperature}
        onReset={handleReset}
      />

      <FeedbackModal
        isOpen={feedbackRequest !== null}
        onClose={() => setFeedbackRequest(null)}
        onSubmit={handleSubmitFeedback}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;
