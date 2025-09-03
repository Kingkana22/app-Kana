import React from 'react';
import { CloudInfrastructure } from '../types';

const ResourceBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
    </div>
);


const CloudInfraDisplay: React.FC<{ infrastructure: CloudInfrastructure }> = ({ infrastructure }) => {
    return (
        <div className="space-y-4">
            <ResourceBar label="CPU Utilization" value={infrastructure.cpu} color="bg-indigo-500" />
            <ResourceBar label="GPU Compute" value={infrastructure.gpu} color="bg-green-500" />
            <ResourceBar label="Storage Capacity" value={infrastructure.storage} color="bg-amber-500" />
        </div>
    );
};

export default CloudInfraDisplay;
