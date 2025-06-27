import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react'; // or use any other icon

const Sidebar = ({ onClose }) => {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-md text-white font-medium ${
      isActive ? 'bg-blue-600' : 'hover:bg-blue-500'
    }`;

  return (
    <div className="w-64 h-screen bg-gray-800 p-4 fixed top-0 left-0 z-50 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Task Management App</h2>
          <button onClick={onClose} className="text-white hover:text-red-400">
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-2">
          <NavLink to="/task" className={linkClass}>
            Task Dashboard
          </NavLink>
          <NavLink to="/assign-task" className={linkClass}>
            Assign Task
          </NavLink>
          <NavLink to="/logs" className={linkClass}>
            Audit Logs
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
