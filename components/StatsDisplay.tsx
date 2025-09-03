import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AITraits, Theme } from '../types';

interface StatsDisplayProps {
  traits: AITraits;
  theme: Theme;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ traits, theme }) => {
  const data = Object.entries(traits).map(([name, value]) => ({
    trait: name,
    value: value,
    fullMark: 10,
  }));

  const tickColor = theme === 'dark' ? '#9ca3af' : '#4b5563';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';
  const tooltipBg = theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  const tooltipBorder = theme === 'dark' ? '#4b5563' : '#d1d5db';
  const tooltipColor = theme === 'dark' ? '#f3f4f6' : '#1f2937';

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <PolarGrid stroke={gridColor} />
          <PolarAngleAxis dataKey="trait" tick={{ fill: tickColor, fontSize: 14 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'transparent' }} />
          <Radar 
            name="AI Trait" 
            dataKey="value" 
            stroke="#6366f1" 
            fill="url(#radarFill)" 
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={500} 
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              color: tooltipColor,
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              fontFamily: "'Roboto', sans-serif",
            }}
            labelStyle={{ color: theme === 'dark' ? '#d1d5db' : '#111827', fontWeight: 'bold' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsDisplay;
