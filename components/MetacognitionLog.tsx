import React from 'react';
import { MetaCognitionEvent, AITraits } from '../types';
import { FiArrowUp, FiArrowDown, FiBookOpen } from 'react-icons/fi';

const TraitAdjustment: React.FC<{ trait: keyof AITraits; value: number }> = ({ trait, value }) => {
  const isPositive = value > 0;
  const color = isPositive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400';
  const Icon = isPositive ? FiArrowUp : FiArrowDown;
  const bg = isPositive ? 'bg-green-100 dark:bg-green-500/20' : 'bg-red-100 dark:bg-red-500/20';

  return (
    <span className={`inline-flex items-center text-xs font-medium ${color} ${bg} px-2 py-1 rounded-full`}>
      <Icon className="mr-1.5" /> {trait} {isPositive ? '+' : ''}{value.toFixed(1)}
    </span>
  );
};

const MetacognitionLog: React.FC<{ events: MetaCognitionEvent[] }> = ({ events }) => {
  return (
    <div className="h-48 overflow-y-auto pr-2 text-sm">
      <ul className="space-y-4">
        {events.length === 0 && (
            <li className="text-gray-500 dark:text-gray-400">No meta-cognitive events recorded.</li>
        )}
        {events.map((event, index) => (
          <li key={index} className="flex flex-col gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-mono">
              <span className="font-bold text-gray-600 dark:text-gray-300">ARCHITECT LOG:</span> "{event.developer_input}"
            </p>
            <div className="flex items-start gap-2 text-purple-700 dark:text-purple-400">
              <FiBookOpen className="mt-0.5 flex-shrink-0" />
              <p className="font-medium italic">"{event.learning_summary}"</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {Object.entries(event.adjustments)
                .filter(([, value]) => value !== 0)
                .map(([key, value]) => (
                  <TraitAdjustment key={key} trait={key as keyof AITraits} value={value as number} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MetacognitionLog;
