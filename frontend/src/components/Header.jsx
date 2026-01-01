import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 ml-64">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600">
          🔔
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + Quick Action
        </button>
      </div>
    </header>
  );
};

export default Header;
