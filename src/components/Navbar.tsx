/**
 * Navbar Component
 * Minimalist, high-contrast header bar featuring search, view layout toggles,
 * theme switch, favorites filter, upload trigger, and keyboard shortcuts guide.
 */

import React from 'react';
import { 
  Search, 
  Plus, 
  Heart, 
  LayoutGrid, 
  Columns3, 
  Grid2X2, 
  Sparkles, 
  Keyboard, 
  SlidersHorizontal,
  Sun,
  Moon
} from 'lucide-react';
import { LayoutMode } from '../types';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  showFilterPanel: boolean;
  onToggleFilterPanel: () => void;
  onOpenUploadModal: () => void;
  onOpenShortcutsModal: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  layoutMode,
  onLayoutChange,
  showOnlyFavorites,
  onToggleFavorites,
  favoritesCount,
  showFilterPanel,
  onToggleFilterPanel,
  onOpenUploadModal,
  onOpenShortcutsModal,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md transition-colors duration-300 border-b ${
      isDarkMode 
        ? 'bg-zinc-950/85 border-zinc-800/80 text-zinc-100' 
        : 'bg-stone-50/85 border-stone-200/80 text-stone-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm font-semibold tracking-tighter ${
              isDarkMode 
                ? 'bg-zinc-100 text-zinc-950' 
                : 'bg-stone-900 text-stone-50'
            }`}>
              <Sparkles className="w-5 h-5 stroke-[2.25]" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight font-serif">Aura Gallery</h1>
              <p className="text-[11px] font-mono opacity-60 -mt-0.5 tracking-wide">CURATED VISUALS</p>
            </div>
          </div>

          {/* Search Bar Input */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className={`relative flex items-center rounded-full border transition-all duration-200 ${
              isDarkMode 
                ? 'bg-zinc-900/90 border-zinc-800 focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-800' 
                : 'bg-white border-stone-300 focus-within:border-stone-500 focus-within:ring-2 focus-within:ring-stone-200'
            }`}>
              <Search className="w-4 h-4 ml-3.5 opacity-50 shrink-0" />
              <input
                type="text"
                placeholder="Search photos, tags, camera, location..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full py-1.5 pl-2.5 pr-4 text-xs font-sans bg-transparent focus:outline-none placeholder:opacity-50"
                id="gallery-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="mr-2 text-xs opacity-50 hover:opacity-100 px-1.5 py-0.5 rounded"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Filter Panel Toggle Button */}
            <button
              onClick={onToggleFilterPanel}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                showFilterPanel
                  ? isDarkMode ? 'bg-zinc-800 text-white' : 'bg-stone-200 text-stone-900'
                  : isDarkMode ? 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200' : 'hover:bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
              title="Toggle Live Photo Filters"
              id="filter-panel-toggle-btn"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden md:inline">Effects</span>
            </button>

            {/* Favorites Filter Button */}
            <button
              onClick={onToggleFavorites}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                showOnlyFavorites
                  ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                  : isDarkMode ? 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200' : 'hover:bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
              title="Filter Favorite Photos"
              id="favorites-toggle-btn"
            >
              <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden md:inline">Liked</span>
              {favoritesCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold ${
                  showOnlyFavorites 
                    ? 'bg-rose-500 text-white' 
                    : isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-stone-200 text-stone-700'
                }`}>
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Layout Mode Selectors */}
            <div className={`hidden lg:flex items-center p-0.5 rounded-lg border ${
              isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-stone-100 border-stone-200'
            }`}>
              <button
                onClick={() => onLayoutChange('grid')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  layoutMode === 'grid'
                    ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-stone-900 shadow-xs'
                    : 'opacity-50 hover:opacity-100'
                }`}
                title="Grid Layout (Standard)"
                id="layout-grid-btn"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLayoutChange('masonry')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  layoutMode === 'masonry'
                    ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-stone-900 shadow-xs'
                    : 'opacity-50 hover:opacity-100'
                }`}
                title="Masonry Dynamic Columns"
                id="layout-masonry-btn"
              >
                <Columns3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLayoutChange('compact')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  layoutMode === 'compact'
                    ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-stone-900 shadow-xs'
                    : 'opacity-50 hover:opacity-100'
                }`}
                title="Compact Grid"
                id="layout-compact-btn"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <button
              onClick={onOpenShortcutsModal}
              className={`p-2 rounded-lg text-xs opacity-60 hover:opacity-100 transition-opacity hidden sm:block ${
                isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-stone-100'
              }`}
              title="Keyboard Shortcuts Guide"
              id="shortcuts-btn"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-lg text-xs transition-colors ${
                isDarkMode ? 'hover:bg-zinc-900 text-amber-400' : 'hover:bg-stone-100 text-stone-700'
              }`}
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Upload Button */}
            <button
              onClick={onOpenUploadModal}
              className={`ml-1 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                isDarkMode 
                  ? 'bg-zinc-100 text-zinc-950 hover:bg-white' 
                  : 'bg-stone-900 text-stone-50 hover:bg-stone-800'
              }`}
              id="upload-modal-trigger-btn"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Photo</span>
            </button>

          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="pb-3 sm:hidden">
          <div className={`relative flex items-center rounded-full border transition-all ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800' 
              : 'bg-white border-stone-300'
          }`}>
            <Search className="w-4 h-4 ml-3 opacity-50 shrink-0" />
            <input
              type="text"
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full py-1.5 pl-2 pr-4 text-xs font-sans bg-transparent focus:outline-none"
              id="mobile-gallery-search-input"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
