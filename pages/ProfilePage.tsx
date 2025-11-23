import React, { useState } from 'react';
import { User, Post } from '../types';
import { Save, User as UserIcon, Camera, Bookmark, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (user: User) => void;
  posts: Post[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser, posts }) => {
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isSaving, setIsSaving] = useState(false);

  // Filter collected posts
  const collectedPosts = posts.filter(post => post.collected);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate network
    setTimeout(() => {
      onUpdateUser({ ...user, username, avatar });
      setIsSaving(false);
      alert('个人资料已更新!');
    }, 500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const reader = new FileReader();
       reader.onload = (ev) => {
         if (ev.target?.result) setAvatar(ev.target.result as string);
       };
       reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Profile Settings */}
      <div className="md:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden h-fit">
        <div className="bg-indigo-600 h-24"></div>
        <div className="px-6 pb-6">
          <div className="relative -mt-12 mb-4 flex flex-col items-center">
            <div className="relative w-24 h-24">
              <img src={avatar} alt="Profile" className="w-full h-full rounded-full border-4 border-white object-cover shadow-md" />
              <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-1.5 rounded-full cursor-pointer hover:bg-gray-900 transition">
                <Camera size={14} />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
               <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">用户名</label>
               <div className="relative">
                 <UserIcon className="absolute left-3 top-2.5 text-gray-400" size={16} />
                 <input 
                   type="text" 
                   value={username} 
                   onChange={(e) => setUsername(e.target.value)}
                   className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                 />
               </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
               <h4 className="text-xs font-semibold text-gray-900 mb-1">角色权限</h4>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-gray-500">当前角色:</span>
                 <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                   {user.role === 'ADMIN' ? '管理员' : '普通用户'}
                 </span>
               </div>
               <p className="text-[10px] text-gray-400 mt-1">管理员拥有删除评论和修改数据的权限。</p>
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition text-sm"
            >
              <Save size={16} /> {isSaving ? '保存中...' : '保存更改'}
            </button>
          </form>
        </div>
      </div>

      {/* Collected Posts */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
           <Bookmark className="text-indigo-600" size={24} /> 我的收藏
        </h2>
        
        {collectedPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {collectedPosts.map(post => (
              <Link to={`/post/${post.id}`} key={post.id} className="block bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-indigo-100 transition group">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{post.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{post.content}</p>
                   </div>
                   {post.image && <img src={post.image} className="w-12 h-12 rounded object-cover ml-3" alt="" />}
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                   <div className="flex items-center gap-1">
                      <img src={post.authorAvatar} className="w-4 h-4 rounded-full" alt="" />
                      <span>{post.authorName}</span>
                   </div>
                   <div className="flex items-center gap-1 text-indigo-500 font-medium">
                      查看详情 <ChevronRight size={12} />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400 border border-dashed border-gray-200">
             <Bookmark size={48} className="mx-auto mb-3 opacity-20" />
             <p>你还没有收藏任何帖子。</p>
             <Link to="/forum" className="text-indigo-600 font-medium hover:underline text-sm mt-2 inline-block">去论坛逛逛</Link>
          </div>
        )}
      </div>
    </div>
  );
};
