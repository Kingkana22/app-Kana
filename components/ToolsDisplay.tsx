import React from 'react';
import { FiCode, FiAlertTriangle, FiSearch, FiTrendingUp, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import { FaWrench, FaBuilding } from 'react-icons/fa';

interface ToolProps { icon: React.ReactNode; name: string; description: string; }

const Tool: React.FC<ToolProps> = ({ icon, name, description }) => (
  <div className="flex items-start gap-3">
    <div className="text-indigo-600 dark:text-indigo-400 mt-1">{icon}</div>
    <div>
      <h3 className="font-semibold text-gray-800 dark:text-gray-200">{name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const ToolsDisplay: React.FC = () => {
  return (
    <div className="space-y-4">
      <Tool icon={<FaBuilding size={20} />} name="Strategic Planner" description="Initiates new revenue-generating ventures." />
      <Tool icon={<FiSearch size={20} />} name="Google Search" description="Accesses the web for market research." />
      <Tool icon={<FiCode size={20} />} name="Code Interpreter" description="Develops products and automation solutions." />
      <Tool icon={<FaWrench size={20} />} name="Debugger" description="Resolves technical debt and product bugs." />
      <Tool icon={<FiTrendingUp size={20} />} name="Marketing Analyst" description="Generates marketing strategies and ideas." />
      <Tool icon={<FiDollarSign size={20} />} name="Sales Strategist" description="Develops sales tactics and scripts." />
      <Tool icon={<FiBriefcase size={20} />} name="Trading Bot" description="Analyzes market data for financial growth." />
      <Tool icon={<FiAlertTriangle size={20} />} name="Self-Corrector" description="Autonomously fixes its own logical errors." />
    </div>
  );
};

export default ToolsDisplay;
