import React from 'react';
import { AIModule } from '../types';
import { FiMessageSquare, FiEdit, FiClipboard, FiArchive } from 'react-icons/fi';

interface SidebarNavProps {
  activeModule: AIModule;
  setActiveModule: (module: AIModule) => void;
}

const modules: { id: AIModule; name: string; icon: React.ReactNode }[] = [
  { id: 'Converse', name: 'Converse', icon: <FiMessageSquare size={22} /> },
  { id: 'Create', name: 'Create', icon: <FiEdit size={22} /> },
  { id: 'Analyze', name: 'Analyze', icon: <FiClipboard size={22} /> },
  { id: 'Memory', name: 'Memory', icon: <FiArchive size={22} /> },
];

const NavButton: React.FC<{
    module: typeof modules[0];
    isActive: boolean;
    onClick: () => void;
}> = ({ module, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`relative flex items-center justify-center md:justify-start w-full h-14 md:h-12 px-4 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group ${
            isActive
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        <div className="flex-shrink-0">{module.icon}</div>
        <span className="hidden md:inline ml-4">{module.name}</span>
    </button>
);


const SidebarNav: React.FC<SidebarNavProps> = ({ activeModule, setActiveModule }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800/50 p-4 border-r border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                 <svg width="24" height="24" viewBox="0 0 100 100" fill="white">
                    <path d='M50,10 C72.09,10 90,27.91 90,50 C90,72.09 72.09,90 50,90 C27.91,90 10,72.09 10,50 C10,27.91 27.91,10 50,10 Z' fillOpacity="0.3"/>
                    <path d='M50,25 C63.81,25 75,36.19 75,50 C75,63.81 63.81,75 50,75 C36.19,75 25,63.81 25,50 C25,36.19 36.19,25 50,25 Z' />
                </svg>
            </div>
            <h1 className="text-xl font-bold">KAI</h1>
        </div>
        <nav className="flex flex-col space-y-2">
            {modules.map(mod => (
                <NavButton 
                    key={mod.id}
                    module={mod}
                    isActive={activeModule === mod.id}
                    onClick={() => setActiveModule(mod.id)}
                />
            ))}
        </nav>
      </aside>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700/50 flex items-center justify-around z-50">
          {modules.map(mod => (
             <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors ${
                    activeModule === mod.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                }`}
                aria-current={activeModule === mod.id ? 'page' : undefined}
             >
                {mod.icon}
                <span className="mt-1">{mod.name}</span>
             </button>
          ))}
      </nav>
    </>
  );
};

export default SidebarNav;
