import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, Post, ChatSession } from './types';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { ForumPage } from './pages/ForumPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChatPage } from './pages/ChatPage';

// Mock Data Initialization
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    authorId: 'admin',
    authorName: 'AdminUser',
    authorAvatar: 'https://picsum.photos/seed/admin/50/50',
    title: 'Welcome to the DevForum!',
    content: 'This is a mock forum built with React to simulate a SpringBoot/Vue architecture. Feel free to test the features!',
    likes: 120,
    views: 540,
    collected: false,
    liked: false,
    timestamp: Date.now() - 10000000,
    comments: [
      {
        id: 'c1',
        postId: '1',
        authorId: 'user2',
        authorName: 'JaneDoe',
        authorAvatar: 'https://picsum.photos/seed/jane/50/50',
        content: 'Great system! Love the design.',
        timestamp: Date.now() - 5000000
      }
    ]
  },
  {
    id: '2',
    authorId: 'user2',
    authorName: 'JaneDoe',
    authorAvatar: 'https://picsum.photos/seed/jane/50/50',
    title: 'How to center a div?',
    content: 'I have been trying for 3 hours. Flexbox? Grid? Help!',
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
    lastMessage: 'Hey, did you solve that CSS issue?',
    messages: [
      { id: 'm1', senderId: 'user2', content: 'Hey, did you solve that CSS issue?', timestamp: Date.now() - 100000, isSelf: false }
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <main className="flex-grow container mx-auto px-4 py-6 max-w-5xl">
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            
            <Route path="/" element={
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
                <ProfilePage user={user!} onUpdateUser={handleLogin} />
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