import React from 'react';
import { FiCode, FiSearch, FiTrendingUp, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import { FaWrench, FaBuilding } from 'react-icons/fa';

interface ToolboxProps { onToolSelect: (prompt: string) => void; }

const PROMPTS = {
  STRATEGIC_PLANNER: `Use the Strategic Planner to propose a new project to...`,
  SEARCH: `Use Google Search to perform market research on...`,
  CODE_INTERPRETER: `// Use Code Interpreter to develop a new product that...\n`,
  DEBUGGER: `// Use Debugger to fix a critical bug in our product:\n\n[PASTE CODE HERE]`,
  MARKETING: `As a Marketing Analyst, create a go-to-market strategy for...`,
  SALES: `As a Sales Strategist, write a sales playbook for...`,
  TRADING: `As a Trading Bot, propose a strategy to capitalize on the following hypothetical market trend...`
};

const ToolboxButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ripple">
        <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>
        <span>{label}</span>
    </button>
);

const Toolbox: React.FC<ToolboxProps> = ({ onToolSelect }) => {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Issue a quick directive:</p>
      <div className="grid grid-cols-2 gap-2">
        <ToolboxButton icon={<FaBuilding size={18} />} label="New Venture" onClick={() => onToolSelect(PROMPTS.STRATEGIC_PLANNER)} />
        <ToolboxButton icon={<FiSearch size={18} />} label="Market Research" onClick={() => onToolSelect(PROMPTS.SEARCH)} />
        <ToolboxButton icon={<FiCode size={18} />} label="Develop Product" onClick={() => onToolSelect(PROMPTS.CODE_INTERPRETER)} />
        <ToolboxButton icon={<FaWrench size={18} />} label="Debug Product" onClick={() => onToolSelect(PROMPTS.DEBUGGER)} />
        <ToolboxButton icon={<FiTrendingUp size={18} />} label="Marketing Plan" onClick={() => onToolSelect(PROMPTS.MARKETING)} />
        <ToolboxButton icon={<FiDollarSign size={18} />} label="Sales Plan" onClick={() => onToolSelect(PROMPTS.SALES)} />
      </div>
    </div>
  );
};

export default Toolbox;