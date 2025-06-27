import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react'; // Add at the top

const SidebarLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {showSidebar && (
        <Sidebar onClose={() => setShowSidebar(false)} />
      )}
      <div
        className={`flex-1 p-6 overflow-y-auto ${
          showSidebar ? 'ml-64' : ''
        } transition-all duration-300`}
      >
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute text-gray-700 hover:text-blue-600"
          >
            <Menu size={28} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
export default SidebarLayout;
