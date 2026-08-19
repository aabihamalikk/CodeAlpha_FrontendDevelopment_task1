/**
 * GalleryGrid Component
 * Container component responsible for structuring photos into Grid, Masonry, or Compact layouts.
 * Features fluid responsive columns and handles empty search states gracefully.
 */

import React from 'react';
import { ImageCard } from './ImageCard';
import { GalleryImage, ImageAdjustments, LayoutMode } from '../types';
import { ImageOff, Search } from 'lucide-react';

interface GalleryGridProps {
  images: GalleryImage[];
  onOpenLightbox: (index: number) => void;
  onToggleLike: (imageId: string, e: React.MouseEvent) => void;
  adjustments: ImageAdjustments;
  layoutMode: LayoutMode;
  isDarkMode: boolean;
  onResetFilters: () => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({
  images,
  onOpenLightbox,
  onToggleLike,
  adjustments,
  layoutMode,
  isDarkMode,
  onResetFilters,
}) => {
  // If search or category returns no results
  if (images.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          isDarkMode ? 'bg-zinc-900 text-zinc-500' : 'bg-stone-100 text-stone-400'
        }`}>
          <ImageOff className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold mb-1 font-serif">No Photos Found</h3>
        <p className="text-xs max-w-sm opacity-60 mb-5">
          We couldn't find any images matching your current search or category filter.
        </p>
        <button
          onClick={onResetFilters}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
            isDarkMode
              ? 'bg-zinc-100 text-zinc-950 hover:bg-white'
              : 'bg-stone-900 text-stone-50 hover:bg-stone-800'
          }`}
          id="clear-search-empty-btn"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  // Determine Grid CSS classes based on selected layout mode
  const getGridClasses = () => {
    switch (layoutMode) {
      case 'compact':
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3';
      case 'masonry':
        return 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4';
      case 'grid':
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6';
    }
  };

  // Rendering for Masonry mode (using column break-inside-avoid)
  if (layoutMode === 'masonry') {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((img, idx) => (
            <div key={img.id} className="break-inside-avoid mb-4">
              <ImageCard
                image={img}
                index={idx}
                onOpenLightbox={onOpenLightbox}
                onToggleLike={onToggleLike}
                adjustments={adjustments}
                isDarkMode={isDarkMode}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Standard Grid / Compact Grid rendering
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className={getGridClasses()}>
        {images.map((img, idx) => (
          <ImageCard
            key={img.id}
            image={img}
            index={idx}
            onOpenLightbox={onOpenLightbox}
            onToggleLike={onToggleLike}
            adjustments={adjustments}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};
