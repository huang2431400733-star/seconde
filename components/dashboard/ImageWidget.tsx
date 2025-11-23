import React from 'react';

export const ImageWidget: React.FC = () => {
  const seed = Math.floor(Math.random() * 1000); 
  const imageUrl = `https://picsum.photos/seed/${seed}/800/1000`;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden group min-h-[300px]">
        <img 
            src={imageUrl} 
            alt="Daily Inspiration" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <p className="text-white text-sm font-medium">每日视觉</p>
            <p className="text-white/80 text-xs">大自然有助于恢复精神疲劳。</p>
        </div>
    </div>
  );
};
