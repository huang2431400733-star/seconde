import React from 'react';
import { QuoteCard } from '../components/dashboard/QuoteCard';
import { TodoList } from '../components/dashboard/TodoList';
import { ImageWidget } from '../components/dashboard/ImageWidget';
import { User } from '../types';

interface DashboardPageProps {
  user: User;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const date = new Date().toLocaleDateString('zh-CN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">早安, {user.username}!</h1>
          <p className="text-slate-500">这里是你的个人专注空间。</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border text-sm font-medium text-slate-600 shadow-sm">
            {date}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Utility */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex-shrink-0">
              <QuoteCard />
            </div>
            <div className="flex-1">
              <TodoList />
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="lg:col-span-5 flex flex-col gap-6">
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">每日视觉</h2>
                <div className="flex-1">
                    <ImageWidget />
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};
