import React, { useState, useEffect, useRef } from 'react';
import { User, ChatSession, ChatMessage } from '../types';
import { Send, Search, Circle } from 'lucide-react';

interface ChatPageProps {
  user: User;
  chats: ChatSession[];
  setChats: React.Dispatch<React.SetStateAction<ChatSession[]>>;
}

export const ChatPage: React.FC<ChatPageProps> = ({ user, chats, setChats }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(chats.length > 0 ? chats[0].id : null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  // Simulate WebSocket: Receiving a reply
  useEffect(() => {
    if (!activeChat) return;
    
    const lastMsg = activeChat.messages[activeChat.messages.length - 1];
    if (lastMsg && lastMsg.isSelf) {
      const timer = setTimeout(() => {
        const reply: ChatMessage = {
          id: Date.now().toString(),
          senderId: 'partner',
          content: `That's interesting! Tell me more about "${lastMsg.content.substring(0, 10)}..."`,
          timestamp: Date.now(),
          isSelf: false
        };
        
        setChats(prev => prev.map(c => {
          if (c.id === activeChat.id) {
            return { ...c, messages: [...c.messages, reply], lastMessage: reply.content };
          }
          return c;
        }));
      }, 2000); // 2 second delay for "friend typing"
      return () => clearTimeout(timer);
    }
  }, [activeChat?.messages, activeChat?.id, setChats]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      content: messageText,
      timestamp: Date.now(),
      isSelf: true
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChat.id) {
        return { ...c, messages: [...c.messages, newMessage], lastMessage: messageText };
      }
      return c;
    }));
    setMessageText('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[calc(100vh-140px)] overflow-hidden flex">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {chats.map(chat => (
            <div 
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition ${activeChatId === chat.id ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''}`}
            >
              <div className="relative">
                <img src={chat.partnerAvatar} alt="" className="w-12 h-12 rounded-full" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{chat.partnerName}</h4>
                  <span className="text-xs text-gray-400">12:30 PM</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                 <img src={activeChat.partnerAvatar} alt="" className="w-10 h-10 rounded-full" />
                 <div>
                   <h3 className="font-bold text-gray-900">{activeChat.partnerName}</h3>
                   <div className="flex items-center gap-1 text-xs text-green-600">
                     <Circle size={8} fill="currentColor" /> Online
                   </div>
                 </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {activeChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isSelf ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm ${msg.isSelf ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 text-right ${msg.isSelf ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                   </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
               <form onSubmit={handleSendMessage} className="flex gap-3">
                 <input 
                   type="text" 
                   value={messageText}
                   onChange={(e) => setMessageText(e.target.value)}
                   placeholder="Type a message..."
                   className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                 />
                 <button 
                   type="submit" 
                   disabled={!messageText.trim()}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition disabled:bg-gray-300"
                 >
                   <Send size={20} />
                 </button>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
             <div className="bg-gray-100 p-6 rounded-full"><Search size={40} /></div>
             <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};