/**
 * Footer Component
 * Minimalist page footer displaying gallery stats and info.
 */

import React from 'react';
import { Camera, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  totalCount: number;
  filteredCount: number;
  likedCount: number;
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  totalCount,
  filteredCount,
  likedCount,
  isDarkMode,
}) => {
  return (
    <footer className={`mt-12 py-8 border-t transition-colors ${
      isDarkMode ? 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400' : 'bg-stone-100/60 border-stone-200/80 text-stone-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
        
        {/* Left Side: Brand */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="font-serif font-semibold text-sm">Aura Gallery</span>
          <span className="opacity-40">•</span>
          <span className="font-mono text-[11px] opacity-70">Interactive Photo Experience</span>
        </div>

        {/* Center: Live Stats */}
        <div className="flex items-center gap-4 font-mono text-[11px] opacity-80">
          <span>Showing <strong className={isDarkMode ? 'text-zinc-200' : 'text-stone-900'}>{filteredCount}</strong> of {totalCount} photos</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <strong className={isDarkMode ? 'text-zinc-200' : 'text-stone-900'}>{likedCount}</strong> Liked
          </span>
        </div>

        {/* Right Side: Keyboard Tip */}
        <div className="text-[11px] font-mono opacity-60">
          Press <kbd className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">← / →</kbd> in Lightbox
        </div>

      </div>
    </footer>
  );
};
