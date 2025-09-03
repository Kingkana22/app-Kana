import React from 'react';
import { Theme } from '../types';
import { FiX } from 'react-icons/fi';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  onReset: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentTheme, onThemeChange, onReset }) => {
  if (!isOpen) return null;
  
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset KAI? This will clear all chat history and memories and cannot be undone.")) {
        onReset();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm relative transition-transform duration-300 transform scale-95"
        style={{ animation: 'scaleUp 0.3s forwards' }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes scaleUp {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <FiX size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h2>
          <div className="space-y-6">
            {/* Theme Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Appearance</label>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onThemeChange('light')}
                  className={`px-4 py-2 rounded-md text-sm font-medium w-full ripple transition-all ${currentTheme === 'light' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  Light
                </button>
                <button
                  onClick={() => onThemeChange('dark')}
                  className={`px-4 py-2 rounded-md text-sm font-medium w-full ripple transition-all ${currentTheme === 'dark' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-semibold text-red-600 dark:text-red-500">Danger Zone</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">This action is permanent and cannot be undone.</p>
              <button 
                onClick={handleReset}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors ripple"
              >
                Reset KAI (Clear All Data)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
