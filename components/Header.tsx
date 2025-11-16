
import React from 'react';
import { AiIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg">
      <div className="max-w-3xl mx-auto flex items-center space-x-3">
        <div className="w-8 h-8 text-blue-400">
            <AiIcon />
        </div>
        <h1 className="text-xl font-bold text-gray-100 tracking-wide">
          Hamza AI Agent
        </h1>
      </div>
    </header>
  );
};

export default Header;