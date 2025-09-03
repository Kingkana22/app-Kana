import React from 'react';
import { LLMStatus } from '../types';
import { FiCpu } from 'react-icons/fi';

const LLMFarmDisplay: React.FC<{ status: LLMStatus }> = ({ status }) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <FiCpu className="text-indigo-600 dark:text-indigo-400" size={24} />
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Model</p>
                    <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{status.modelName}</p>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next-Gen Model Training</span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{status.trainingProgress.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-4 rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${status.trainingProgress}%` }}>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LLMFarmDisplay;
