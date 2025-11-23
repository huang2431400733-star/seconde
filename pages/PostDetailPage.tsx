import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Post, UserRole, Comment } from '../types';
import { ThumbsUp, Bookmark, MessageCircle, Trash2, ArrowLeft, Send, Edit } from 'lucide-react';

interface PostDetailPageProps {
  user: User;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

export const PostDetailPage: React.FC<PostDetailPageProps> = ({ user, posts, setPosts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState('');
  const [post, setPost] = useState<Post | undefined>(undefined);
  
  // Local edit state for Admin Like Modification
  const [isEditingLikes, setIsEditingLikes] = useState(false);
  const [editLikesValue, setEditLikesValue] = useState(0);

  useEffect(() => {
    const found = posts.find(p => p.id === id);
    setPost(found);
    if(found) setEditLikesValue(found.likes);
  }, [id, posts]);

  if (!post) return <div className="p-8 text-center">Post not found</div>;

  const handleLike = () => {
    const updatedPost = { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 };
    updatePostInState(updatedPost);
  };

  const handleCollect = () => {
    const updatedPost = { ...post, collected: !post.collected };
    updatePostInState(updatedPost);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      authorId: user.id,
      authorName: user.username,
      authorAvatar: user.avatar,
      content: commentText,
      timestamp: Date.now()
    };

    const updatedPost = { ...post, comments: [...post.comments, newComment] };
    updatePostInState(updatedPost);
    setCommentText('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (user.role !== UserRole.ADMIN) return;
    const updatedComments = post.comments.filter(c => c.id !== commentId);
    updatePostInState({ ...post, comments: updatedComments });
  };

  const handleAdminUpdateLikes = () => {
    if (user.role !== UserRole.ADMIN) return;
    updatePostInState({ ...post, likes: editLikesValue });
    setIsEditingLikes(false);
  };

  const updatePostInState = (updatedPost: Post) => {
    setPost(updatedPost);
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-indigo-600 mb-4 transition">
        <ArrowLeft size={18} className="mr-1" /> Back to Feed
      </button>

      {/* Post Content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        {post.image && (
           <div className="w-full h-64 sm:h-80 bg-gray-100">
             <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
           </div>
        )}
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-medium text-gray-900">{post.authorName}</p>
                <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleString()}</p>
              </div>
            </div>
            
            {/* Interactions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-50 rounded-full px-3 py-1">
                <button 
                  onClick={handleLike}
                  className={`p-1 rounded-full transition ${post.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <ThumbsUp size={20} fill={post.liked ? "currentColor" : "none"} />
                </button>
                
                {/* Admin Edit Likes */}
                {user.role === UserRole.ADMIN && isEditingLikes ? (
                  <div className="flex items-center ml-2">
                     <input 
                        type="number" 
                        value={editLikesValue} 
                        onChange={(e) => setEditLikesValue(Number(e.target.value))}
                        className="w-16 border rounded px-1 py-0.5 text-sm"
                     />
                     <button onClick={handleAdminUpdateLikes} className="ml-1 text-green-600 text-xs font-bold">OK</button>
                  </div>
                ) : (
                  <span className="mx-2 font-medium text-gray-700">{post.likes}</span>
                )}
                
                {user.role === UserRole.ADMIN && !isEditingLikes && (
                   <button onClick={() => setIsEditingLikes(true)} className="text-gray-300 hover:text-indigo-500">
                      <Edit size={12} />
                   </button>
                )}
              </div>

              <button 
                onClick={handleCollect}
                className={`p-2 rounded-full bg-gray-50 transition ${post.collected ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              >
                <Bookmark size={20} fill={post.collected ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          <div className="prose max-w-none text-gray-800">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
           <MessageCircle className="text-indigo-600" /> 
           Comments ({post.comments.length})
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleAddComment} className="mb-8 flex gap-4">
           <img src={user.avatar} className="w-10 h-10 rounded-full flex-shrink-0" alt="You" />
           <div className="flex-grow relative">
             <textarea
               value={commentText}
               onChange={(e) => setCommentText(e.target.value)}
               placeholder="Write a respectful reply..."
               className="w-full p-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-gray-50 focus:bg-white transition"
               rows={2}
             />
             <button 
               type="submit" 
               disabled={!commentText.trim()}
               className="absolute right-3 bottom-3 text-indigo-600 hover:text-indigo-800 disabled:text-gray-300"
             >
               <Send size={20} />
             </button>
           </div>
        </form>

        {/* Comment List */}
        <div className="space-y-6">
           {post.comments.map((comment) => (
             <div key={comment.id} className="flex gap-4 group">
                <img src={comment.authorAvatar} alt={comment.authorName} className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-grow">
                   <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none">
                      <div className="flex justify-between items-start mb-1">
                         <span className="font-semibold text-sm text-gray-900">{comment.authorName}</span>
                         <span className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-gray-800 text-sm">{comment.content}</p>
                   </div>
                   
                   {/* Admin Actions */}
                   {user.role === UserRole.ADMIN && (
                     <div className="mt-1 ml-2">
                        <button 
                           onClick={() => handleDeleteComment(comment.id)}
                           className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition"
                        >
                           <Trash2 size={12} /> Delete Comment
                        </button>
                     </div>
                   )}
                </div>
             </div>
           ))}
           {post.comments.length === 0 && <p className="text-center text-gray-400 py-4">No comments yet.</p>}
        </div>
      </div>
    </div>
  );
};