import React, { useState, useMemo } from 'react';
import { User, Post } from '../types';
import { Link } from 'react-router-dom';
import { Plus, Flame, Clock, Image as ImageIcon, Sparkles } from 'lucide-react';
import { generatePostContent } from '../services/geminiService';

interface ForumPageProps {
  user: User;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export const ForumPage: React.FC<ForumPageProps> = ({ user, posts, setPosts }) => {
  const [sortBy, setSortBy] = useState<'latest' | 'hottest'>('latest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create Post State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (sortBy === 'hottest') return b.likes - a.likes;
      return b.timestamp - a.timestamp;
    });
  }, [posts, sortBy]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setNewImage(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleGenerateAI = async () => {
    if (!newTitle && !newContent) {
      alert("Please enter a topic in the title field to generate content.");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generatePostContent(newTitle || "Latest technology trends");
      setNewTitle(result.title);
      setNewContent(result.content);
    } catch (e) {
      alert("Failed to generate content. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.username,
      authorAvatar: user.avatar,
      title: newTitle,
      content: newContent,
      image: newImage || undefined,
      likes: 0,
      views: 0,
      collected: false,
      liked: false,
      timestamp: Date.now(),
      comments: []
    };
    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewImage(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Sidebar / Main Feed */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Header & Sort */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setSortBy('latest')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${sortBy === 'latest' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <div className="flex items-center gap-2"><Clock size={16} /> Latest</div>
            </button>
            <button
              onClick={() => setSortBy('hottest')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${sortBy === 'hottest' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <div className="flex items-center gap-2"><Flame size={16} /> Hottest</div>
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition"
          >
            <Plus size={18} /> Create Post
          </button>
        </div>

        {/* Post List */}
        <div className="space-y-4">
          {sortedPosts.map((post) => (
            <Link to={`/post/${post.id}`} key={post.id} className="block group">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-transparent group-hover:border-indigo-100 transition duration-200">
                 <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition">{post.title}</h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(post.timestamp).toLocaleDateString()}</span>
                 </div>
                 <p className="text-gray-600 line-clamp-2 mb-4 text-sm">{post.content}</p>
                 {post.image && (
                   <div className="mb-4 h-48 w-full bg-gray-100 rounded-lg overflow-hidden relative">
                     <img src={post.image} alt="Post attachment" className="w-full h-full object-cover" />
                   </div>
                 )}
                 <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <img src={post.authorAvatar} alt="" className="w-5 h-5 rounded-full" />
                      <span>{post.authorName}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><Flame size={14} /> {post.likes}</span>
                      <span className="flex items-center gap-1">Comments: {post.comments.length}</span>
                    </div>
                 </div>
              </div>
            </Link>
          ))}
          {sortedPosts.length === 0 && (
             <div className="text-center py-12 text-gray-400">No posts yet. Be the first!</div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <h2 className="text-xl font-bold mb-2">Welcome, {user.username}!</h2>
          <p className="text-indigo-100 text-sm mb-4">Ready to share your thoughts with the community?</p>
          <div className="text-xs bg-white/20 p-3 rounded-lg">
            <strong>Tip:</strong> Admins can moderate comments and adjust like counts.
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-bold text-gray-700 mb-3">Community Guidelines</h3>
          <ul className="text-sm text-gray-500 space-y-2 list-disc pl-4">
             <li>Be respectful to others.</li>
             <li>No spam or self-promotion.</li>
             <li>Use the search before posting.</li>
             <li>Have fun!</li>
          </ul>
        </div>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Create New Post</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmitPost} className="p-6 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Post Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition flex items-center gap-2 text-sm font-medium"
                >
                  <Sparkles size={16} />
                  {isGenerating ? 'Thinking...' : 'AI Assist'}
                </button>
              </div>
              
              <textarea
                placeholder="What's on your mind?"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                required
              />
              
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 px-4 py-2 border rounded-lg border-dashed hover:border-indigo-500 transition">
                  <ImageIcon size={18} />
                  {newImage ? 'Change Image' : 'Add Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
                {newImage && <span className="text-xs text-green-600">Image attached</span>}
              </div>

              {newImage && (
                <img src={newImage} alt="Preview" className="h-20 rounded-lg object-cover border" />
              )}

              <div className="pt-4 flex justify-end gap-3">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                 <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};