import React from 'react';
import { FiGrid, FiMessageSquare, FiTool } from 'react-icons/fi';

type ActiveView = 'dashboard' | 'chat' | 'tools';

interface BottomNavBarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

const views: ActiveView[] = ['dashboard', 'chat', 'tools'];

const NavButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`relative z-10 flex flex-col items-center justify-center w-full h-full text-xs transition-colors duration-300 ${
            isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className={`mt-1 transition-opacity ${isActive ? 'font-bold' : 'font-normal'}`}>{label}</span>
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, onViewChange }) => {
    const activeIndex = views.indexOf(activeView);
    const indicatorPosition = `${activeIndex * (100 / views.length)}%`;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around z-10">
            {/* Sliding Indicator */}
            <div 
                className="absolute top-1/2 -translate-y-1/2 h-12 w-24 bg-indigo-50 dark:bg-indigo-900/50 rounded-full transition-all duration-300 ease-in-out"
                style={{
                    left: indicatorPosition,
                    transform: `translateX(calc(${indicatorPosition} * -0.5 + 1rem))`,
                    width: 'calc(100% / 3 - 1rem)'
                }}
            ></div>
            
            <NavButton
                icon={<FiGrid size={22} />}
                label="Dashboard"
                isActive={activeView === 'dashboard'}
                onClick={() => onViewChange('dashboard')}
            />
            <NavButton
                icon={<FiMessageSquare size={22} />}
                label="Chat"
                isActive={activeView === 'chat'}
                onClick={() => onViewChange('chat')}
            />
            <NavButton
                icon={<FiTool size={22} />}
                label="Tools"
                isActive={activeView === 'tools'}
                onClick={() => onViewChange('tools')}
            />
        </nav>
    );
};

export default BottomNavBar;
