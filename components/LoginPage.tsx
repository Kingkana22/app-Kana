import React from 'react';
import { FiGithub, FiCpu } from 'react-icons/fi';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="text-center p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 mb-6">
          <FiCpu size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Autonomous Corp</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          An AI-driven corporate simulation.
        </p>
        <button
          onClick={onLogin}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-900 dark:hover:bg-white transition-colors ripple"
        >
          <FiGithub size={20} />
          <span>Sign in with GitHub</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
