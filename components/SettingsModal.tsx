import React from 'react';
import { Theme, AIMode } from '../types';
import { FiX } from 'react-icons/fi';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  currentMode: AIMode;
  onModeChange: (mode: AIMode) => void;
  currentTemp: number;
  onTempChange: (temp: number) => void;
  onReset: () => void;
}

const ALL_MODES: AIMode[] = ['Safe', 'Edge', 'Hacker'];

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, onClose, currentTheme, onThemeChange,
    currentMode, onModeChange, currentTemp, onTempChange, onReset
}) => {

  if (!isOpen) return null;
  
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the entire corporation? This action cannot be undone.")) {
        onReset();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <FiX size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Control Center</h2>

          <div className="space-y-6">
            {/* AI Personality */}
            <div>
              <label htmlFor="ai-mode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Personality Core</label>
              <select 
                id="ai-mode"
                value={currentMode} 
                onChange={e => onModeChange(e.target.value as AIMode)} 
                className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-gray-200"
              >
                {ALL_MODES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {/* Temperature */}
            <div>
                 <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Creativity (Temperature): <span className="font-bold">{currentTemp.toFixed(1)}</span>
                 </label>
                 <input 
                    id="temperature"
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={currentTemp}
                    onChange={e => onTempChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                 />
            </div>
            
            {/* Theme Toggle */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appearance</label>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => onThemeChange('light')}
                        className={`px-4 py-2 rounded-md text-sm font-medium w-full ripple ${currentTheme === 'light' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        Light
                    </button>
                    <button
                        onClick={() => onThemeChange('dark')}
                        className={`px-4 py-2 rounded-md text-sm font-medium w-full ripple ${currentTheme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                    >
                        Dark
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold text-red-600 dark:text-red-500">Danger Zone</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">These actions are permanent and cannot be undone.</p>
                <button 
                    onClick={handleReset}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 ripple"
                >
                    Reset Corporation
                </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;