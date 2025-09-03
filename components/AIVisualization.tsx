import React from 'react';
import { AITraits } from '../types';

interface AIVisualizationProps {
  traits: AITraits;
  isLoading: boolean;
  dominantTrait: keyof AITraits;
}

const traitColors: Record<keyof AITraits, string> = {
    Logic: '#3b82f6', // blue-500
    Creativity: '#8b5cf6', // violet-500
    Memory: '#f59e0b', // amber-500
    Adaptability: '#22c55e', // green-500
    Ethics: '#ec4899', // pink-500
};

const AIVisualization: React.FC<AIVisualizationProps> = ({ isLoading, dominantTrait }) => {
  const dominantColor = traitColors[dominantTrait];

  return (
    <div className="w-full h-24 flex items-center justify-center relative">
      <svg viewBox="0 0 100 100" className="w-20 h-20 overflow-visible">
        <defs>
          <filter id="glow_light">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Pulsing Outer Glow */}
        {isLoading && (
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill={dominantColor}
            fillOpacity="0.5"
            >
            <animate
              attributeName="r"
              from="40"
              to="50"
              dur="1.5s"
              begin="0s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.5"
              to="0"
              dur="1.5s"
              begin="0s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Main Icon */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={dominantColor}
          strokeWidth="4"
          strokeOpacity="0.2"
          style={{ transition: 'stroke 0.5s ease-in-out' }}
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={dominantColor}
          strokeWidth="2"
          filter="url(#glow_light)"
          style={{ transition: 'stroke 0.5s ease-in-out' }}
        />
         <circle
          cx="50"
          cy="50"
          r="20"
          fill={dominantColor}
          style={{ transition: 'fill 0.5s ease-in-out' }}
        />
      </svg>
    </div>
  );
};

export default AIVisualization;