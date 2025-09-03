import React from 'react';
import { ActiveProject } from '../types';
import { FiLoader, FiCheckCircle, FiPlayCircle, FiDollarSign, FiPauseCircle } from 'react-icons/fi';

const getStatusIcon = (status: ActiveProject['status']) => {
    switch (status) {
        case 'Initiated': return <FiPlayCircle className="text-blue-500 dark:text-blue-400" />;
        case 'In Progress': return <FiLoader className="text-yellow-500 dark:text-yellow-400 animate-spin" />;
        case 'Generating Revenue': return <FiDollarSign className="text-green-500 dark:text-green-400" />;
        case 'Completed': return <FiCheckCircle className="text-gray-400 dark:text-gray-500" />;
        case 'Stalled': return <FiPauseCircle className="text-red-500 dark:text-red-400" />;
    }
}

const ProjectNexus: React.FC<{ projects: ActiveProject[] }> = ({ projects }) => {
    return (
        <div className="h-40 overflow-y-auto pr-2">
            <ul className="space-y-3">
                {projects.length === 0 && (
                    <li className="text-gray-500 dark:text-gray-400 text-sm">No active ventures.</li>
                )}
                {projects.map((project, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                           {getStatusIcon(project.status)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{project.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{project.status}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectNexus;