/**
 * CategoryBar Component
 * Renders category filter pills with photo count indicators.
 * Allows instant visual filtering of the gallery.
 */

import React from 'react';
import { ImageCategory } from '../types';

interface CategoryBarProps {
  categories: ImageCategory[];
  activeCategory: ImageCategory;
  onSelectCategory: (cat: ImageCategory) => void;
  categoryCounts: Record<string, number>;
  totalImagesCount: number;
  isDarkMode: boolean;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  categoryCounts,
  totalImagesCount,
  isDarkMode,
}) => {
  return (
    <div className="py-4 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center gap-2 min-w-max px-4 sm:px-6 lg:px-8">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const count = category === 'All' ? totalImagesCount : (categoryCounts[category] || 0);

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? isDarkMode
                    ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm scale-[1.02]'
                    : 'bg-stone-900 text-stone-50 font-semibold shadow-sm scale-[1.02]'
                  : isDarkMode
                    ? 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800/60'
                    : 'bg-stone-100/90 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900 border border-stone-200/80'
              }`}
              id={`category-pill-${category.toLowerCase()}`}
            >
              <span>{category}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-normal transition-colors ${
                isActive
                  ? isDarkMode ? 'bg-zinc-300 text-zinc-950' : 'bg-stone-700 text-stone-100'
                  : isDarkMode ? 'bg-zinc-800/80 text-zinc-500' : 'bg-stone-200/80 text-stone-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
