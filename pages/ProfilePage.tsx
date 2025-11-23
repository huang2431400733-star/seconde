import React, { useState } from 'react';
import { User } from '../types';
import { Save, User as UserIcon, Camera } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate network
    setTimeout(() => {
      onUpdateUser({ ...user, username, avatar });
      setIsSaving(false);
      alert('Profile updated!');
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
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-indigo-600 h-32"></div>
      <div className="px-8 pb-8">
        <div className="relative -mt-16 mb-6 flex flex-col items-center">
          <div className="relative w-32 h-32">
            <img src={avatar} alt="Profile" className="w-full h-full rounded-full border-4 border-white object-cover shadow-md" />
            <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-900 transition">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
             <div className="relative">
               <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
               <input 
                 type="text" 
                 value={username} 
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
               />
             </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
             <h4 className="text-sm font-semibold text-gray-900 mb-2">Role Information</h4>
             <div className="flex items-center justify-between text-sm">
               <span className="text-gray-500">Current Role:</span>
               <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                 {user.role}
               </span>
             </div>
             <p className="text-xs text-gray-400 mt-2">Roles are assigned during registration (use 'admin' as username for privileges).</p>
          </div>

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition"
          >
            <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};