import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { generateInspirationalQuote } from '../../services/geminiService';
import { QuoteData } from '../../types';

export const QuoteCard: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData>({
    text: "加载灵感中...",
    author: "Gemini AI"
  });
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const data = await generateInspirationalQuote();
      setQuote(data);
    } catch (err) {
      // Fallback handled in service
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="relative p-8 flex flex-col items-center text-center gap-4 overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 h-full justify-center">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
          <Sparkles size={16} />
          <span>每日智慧</span>
        </div>
        <button 
            onClick={fetchQuote} 
            disabled={loading}
            className={`p-2 rounded-full hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all ${loading ? 'animate-spin' : ''}`}
            title="刷新名言"
        >
            <RefreshCcw size={18} />
        </button>
      </div>

      <blockquote className="relative z-10">
        <p className={`text-2xl md:text-3xl font-serif italic text-slate-700 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          "{quote.text}"
        </p>
        <footer className="mt-4 text-slate-500 font-medium">
          — {quote.author}
        </footer>
      </blockquote>
    </div>
  );
};
