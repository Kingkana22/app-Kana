import React from 'react';
import { Financials } from '../types';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string; darkColor: string }> = ({ icon, label, value, color, darkColor }) => (
    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className={`p-2 rounded-full ${color} ${darkColor}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

const FinancialsDisplay: React.FC<{ financials: Financials }> = ({ financials }) => {
    return (
        <div className="space-y-3">
            <StatCard 
                icon={<FiTrendingUp size={20} />} 
                label="Total Revenue" 
                value={`$${financials.totalRevenue.toLocaleString()}k`}
                color="bg-green-100 text-green-700"
                darkColor="dark:bg-green-900/50 dark:text-green-400"
            />
            <StatCard 
                icon={<FiTrendingDown size={20} />} 
                label="Operational Costs" 
                value={`$${financials.operationalCosts.toLocaleString()}k`}
                color="bg-red-100 text-red-700"
                darkColor="dark:bg-red-900/50 dark:text-red-400"
            />
             <StatCard 
                icon={<FiDollarSign size={20} />} 
                label="Net Profit" 
                value={`$${financials.netProfit.toLocaleString()}k`}
                color="bg-indigo-100 text-indigo-700"
                darkColor="dark:bg-indigo-900/50 dark:text-indigo-400"
            />
        </div>
    );
};

export default FinancialsDisplay;
