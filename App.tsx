import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatMessage, Memory, AIModule, Theme } from './types';
import { createMemorySummary } from './services/geminiService';

import LoginPage from './components/LoginPage';
import SidebarNav from './components/SidebarNav';
import ConverseModule from './components/ConverseModule';
import CreateModule from './components/CreateModule';
import AnalyzeModule from './components/AnalyzeModule';
import MemoryModule from './components/MemoryModule';
import SettingsModal from './components/SettingsModal';
import { FiSettings } from 'react-icons/fi';

// --- Local Storage Persistence ---

interface SavedState {
  chatHistory: ChatMessage[];
  memories: Memory[];
  theme: Theme;
  isAuthenticated: boolean;
}

const loadState = (): Partial<SavedState> => {
  try {
    const serializedState = localStorage.getItem('kaiAIState');
    if (serializedState === null) return {};
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Error loading state from local storage:", error);
    return {};
  }
};

// --- App Component ---

const App: React.FC = () => {
  const savedState = useMemo(() => loadState(), []);

  // State Management
  const [theme, setTheme] = useState<Theme>(savedState.theme || 'dark');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(savedState.isAuthenticated || false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(savedState.chatHistory || [{ sender: 'ai', text: 'Hello! I am KAI, your personal AI companion. How can I help you today?', id: Date.now() }]);
  const [memories, setMemories] = useState<Memory[]>(savedState.memories || []);
  const [activeModule, setActiveModule] = useState<AIModule>('Converse');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommittingMemory, setIsCommittingMemory] = useState(false);

  // Effect to save state to localStorage whenever a persisted state changes
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const stateToSave: SavedState = { chatHistory, memories, theme, isAuthenticated };
    try {
      localStorage.setItem('kaiAIState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving state to local storage:", error);
    }
  }, [chatHistory, memories, theme, isAuthenticated]);

  // Effect to apply theme class to HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const handleLogin = () => setIsAuthenticated(true);

  const handleReset = () => {
    localStorage.removeItem('kaiAIState');
    setIsAuthenticated(false);
    setChatHistory([{ sender: 'ai', text: 'Hello! I am KAI, your personal AI companion. How can I help you today?', id: Date.now() }]);
    setMemories([]);
    setTheme('dark');
    setActiveModule('Converse');
    setIsSettingsOpen(false);
  };

  const handleCommitToMemory = useCallback(async (messageToRemember: string) => {
    setIsCommittingMemory(true);
    setChatHistory(prev => [...prev, { sender: 'system', text: 'KAI is committing this to memory...', id: Date.now() }]);
    try {
      const summary = await createMemorySummary(messageToRemember);
      const newMemory: Memory = {
        id: Date.now(),
        content: messageToRemember,
        summary: summary,
        createdAt: new Date().toISOString(),
      };
      setMemories(prev => [newMemory, ...prev]);
      setChatHistory(prev => [...prev.slice(0, -1), { sender: 'system', text: `Memory created: "${summary}"`, id: Date.now() + 1 }]);
    } catch (error) {
      console.error("Failed to create memory:", error);
      setChatHistory(prev => [...prev.slice(0, -1), { sender: 'system', text: 'Error: Could not create memory.', id: Date.now() + 1 }]);
    } finally {
      setIsCommittingMemory(false);
    }
  }, []);

  const renderActiveModule = () => {
    const moduleProps = {
      key: activeModule, // Ensures component re-mounts on change for clean state
      isMemoryLoading: isCommittingMemory,
    };
    switch (activeModule) {
      case 'Converse':
        return <ConverseModule {...moduleProps} chatHistory={chatHistory} setChatHistory={setChatHistory} onCommitToMemory={handleCommitToMemory} />;
      case 'Create':
        return <CreateModule {...moduleProps} />;
      case 'Analyze':
        return <AnalyzeModule {...moduleProps} />;
      case 'Memory':
        return <MemoryModule {...moduleProps} memories={memories} setMemories={setMemories} />;
      default:
        return <ConverseModule {...moduleProps} chatHistory={chatHistory} setChatHistory={setChatHistory} onCommitToMemory={handleCommitToMemory} />;
    }
  };
  
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans`}>
      <SidebarNav activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-4 right-4 z-20">
            <button 
                onClick={() => setIsSettingsOpen(true)} 
                className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-800/50 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                aria-label="Open Settings"
            >
                <FiSettings />
            </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderActiveModule()}
        </div>
      </main>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
        onReset={handleReset}
      />
    </div>
  );
};

export default App;
