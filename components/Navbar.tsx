import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, Users, LogOut, MessageCircle } from 'lucide-react';
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
              <LayoutDashboard size={24} className="mb-1" />
              工作台
            </Link>
            <Link to="/forum" className={`flex flex-col items-center text-xs font-medium ${isActive('/forum')}`}>
              <Users size={24} className="mb-1" />
              论坛
            </Link>
            <Link to="/chat" className={`flex flex-col items-center text-xs font-medium ${isActive('/chat')}`}>
              <MessageCircle size={24} className="mb-1" />
              消息
            </Link>
            <Link to="/profile" className={`flex flex-col items-center text-xs font-medium ${isActive('/profile')}`}>
              <div className="relative">
                 <img src={user.avatar} alt={user.username} className="w-6 h-6 rounded-full border mb-1 object-cover" />
              </div>
              我的
            </Link>
            <button onClick={onLogout} className="flex flex-col items-center text-xs font-medium text-gray-500 hover:text-red-600">
              <LogOut size={24} className="mb-1" />
              退出
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
