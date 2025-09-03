import React from 'react';
import { FiGithub } from 'react-icons/fi';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="text-center p-8 max-w-md mx-auto">
         <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-600 mb-6 shadow-lg"
            style={{
                background: 'linear-gradient(145deg, #7075ff, #5d61e6)',
                boxShadow: '8px 8px 16px #4e51c2, -8px -8px 16px #7c81ff'
            }}
         >
            <svg width="40" height="40" viewBox="0 0 100 100" fill="white">
                <path d='M50,10 C72.09,10 90,27.91 90,50 C90,72.09 72.09,90 50,90 C27.91,90 10,72.09 10,50 C10,27.91 27.91,10 50,10 Z' fillOpacity="0.3"/>
                <path d='M50,25 C63.81,25 75,36.19 75,50 C75,63.81 63.81,75 50,75 C36.19,75 25,63.81 25,50 C25,36.19 36.19,25 50,25 Z' />
            </svg>
        </div>
        <h1 className="text-5xl font-bold mb-2">KAI</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Your Personal AI Companion
        </p>
        <button
          onClick={onLogin}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded-lg font-semibold hover:bg-gray-900 dark:hover:bg-white transition-all transform hover:scale-105 shadow-lg ripple"
        >
          <FiGithub size={20} />
          <span>Sign in with GitHub</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
