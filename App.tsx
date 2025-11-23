import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Post, ChatSession } from './types';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { ForumPage } from './pages/ForumPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChatPage } from './pages/ChatPage';
import { DashboardPage } from './pages/DashboardPage';

// Mock Data Initialization (Translated)
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'admin',
    authorName: 'AdminUser',
    authorAvatar: 'https://picsum.photos/seed/admin/50/50',
    title: '欢迎来到开发者社区!',
    content: '这是一个模拟 SpringBoot/Vue 架构的 React 论坛系统。欢迎测试各项功能！管理员账号具有特殊权限。',
    likes: 120,
    views: 540,
    collected: true,
    liked: true,
    timestamp: Date.now() - 10000000,
    comments: [
      {
        id: 'c1',
        postId: '1',
        authorId: 'user2',
        authorName: 'JaneDoe',
        authorAvatar: 'https://picsum.photos/seed/jane/50/50',
        content: '系统做得很棒！UI设计很简洁。',
        timestamp: Date.now() - 5000000
      }
    ]
  },
  {
    id: '2',
    authorId: 'user2',
    authorName: 'JaneDoe',
    authorAvatar: 'https://picsum.photos/seed/jane/50/50',
    title: '如何让 Div 居中?',
    content: '我已经试了3个小时了。Flexbox? Grid? 救命!',
    image: 'https://picsum.photos/seed/css/600/300',
    likes: 5,
    views: 42,
    collected: false,
    liked: false,
    timestamp: Date.now() - 2000000,
    comments: []
  }
];

const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'chat1',
    partnerName: 'JaneDoe',
    partnerAvatar: 'https://picsum.photos/seed/jane/50/50',
    lastMessage: '嘿，你解决那个 CSS 问题了吗?',
    messages: [
      { id: 'm1', senderId: 'user2', content: '嘿，你解决那个 CSS 问题了吗?', timestamp: Date.now() - 100000, isSelf: false }
    ]
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [chats, setChats] = useState<ChatSession[]>(INITIAL_CHATS);

  // Load user from "localStorage" mock
  useEffect(() => {
    const storedUser = localStorage.getItem('forum_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('forum_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('forum_user');
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="flex-grow container mx-auto px-4 py-6 max-w-5xl">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                 <DashboardPage user={user!} />
              </ProtectedRoute>
            } />

            <Route path="/forum" element={
              <ProtectedRoute>
                <ForumPage user={user!} posts={posts} setPosts={setPosts} />
              </ProtectedRoute>
            } />
            
            <Route path="/post/:id" element={
              <ProtectedRoute>
                <PostDetailPage user={user!} posts={posts} setPosts={setPosts} />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage user={user!} onUpdateUser={handleLogin} posts={posts} />
              </ProtectedRoute>
            } />
            
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage user={user!} chats={chats} setChats={setChats} />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
