import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate Network Delay for "Encryption & JWT"
    setTimeout(() => {
      const mockUser: User = {
        id: username.toLowerCase() === 'admin' ? 'admin' : `user-${Date.now()}`,
        username: username,
        // Admin credential check simulation
        role: username.toLowerCase() === 'admin' ? UserRole.ADMIN : UserRole.USER,
        avatar: `https://picsum.photos/seed/${username}/200/200`
      };
      
      onLogin(mockUser);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRegister ? '加入社区' : '欢迎回来'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isRegister ? '创建账号开始发帖。' : '登录以访问论坛。'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="输入 'admin' 可体验管理员功能"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="任意密码即可"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>加载中...</span>
            ) : isRegister ? (
              <>
                <UserPlus size={18} /> 注册
              </>
            ) : (
              <>
                <LogIn size={18} /> 登录
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isRegister ? '已有账号? 登录' : "还没有账号? 注册"}
          </button>
        </div>
      </div>
    </div>
  );
};
