import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Home, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900';

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <MessageSquare size={20} />
              </div>
              <span className="font-bold text-xl text-gray-800">DevForum</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className={`flex flex-col items-center text-xs font-medium ${isActive('/')}`}>
              <Home size={24} className="mb-1" />
              Forum
            </Link>
            <Link to="/chat" className={`flex flex-col items-center text-xs font-medium ${isActive('/chat')}`}>
              <MessageSquare size={24} className="mb-1" />
              Chat
            </Link>
            <Link to="/profile" className={`flex flex-col items-center text-xs font-medium ${isActive('/profile')}`}>
              <UserIcon size={24} className="mb-1" />
              Profile
            </Link>
            <button onClick={onLogout} className="flex flex-col items-center text-xs font-medium text-gray-500 hover:text-red-600">
              <LogOut size={24} className="mb-1" />
              Logout
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-3 pl-4 border-l">
             <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full border" />
             <div className="text-sm">
               <p className="font-semibold text-gray-800 leading-none">{user.username}</p>
               <p className="text-xs text-gray-500 leading-none mt-1 uppercase">{user.role}</p>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};