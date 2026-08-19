/**
 * ImageCard Component
 * Displays an individual photo with hover lift effects, smooth zoom on hover,
 * favorite heart toggle, photographer avatar tag, and category badge.
 * Fully supports live CSS image filter preview.
 */

import React, { useState } from 'react';
import { Heart, Maximize2, MapPin, Camera } from 'lucide-react';
import { GalleryImage, ImageAdjustments } from '../types';
import { getCssFilterString } from '../utils/imageFilters';

interface ImageCardProps {
  image: GalleryImage;
  index: number;
  onOpenLightbox: (index: number) => void;
  onToggleLike: (imageId: string, e: React.MouseEvent) => void;
  adjustments: ImageAdjustments;
  isDarkMode: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  index,
  onOpenLightbox,
  onToggleLike,
  adjustments,
  isDarkMode,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const filterStyle = getCssFilterString(adjustments);

  // Map aspect ratio helper class for standard grid layout
  const getAspectRatioClass = (ratio: GalleryImage['aspectRatio']) => {
    switch (ratio) {
      case 'portrait':
        return 'aspect-[3/4]';
      case 'landscape':
        return 'aspect-[4/3]';
      case 'wide':
        return 'aspect-[16/9]';
      case 'square':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div
      onClick={() => onOpenLightbox(index)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform-gpu hover:-translate-y-1 hover:shadow-xl ${
        isDarkMode 
          ? 'bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 hover:shadow-zinc-950/50' 
          : 'bg-white border border-stone-200/90 hover:border-stone-300 hover:shadow-stone-300/40'
      }`}
      id={`image-card-${image.id}`}
    >
      {/* Image Container with Aspect Ratio */}
      <div className={`relative w-full overflow-hidden ${getAspectRatioClass(image.aspectRatio)} bg-stone-200 dark:bg-zinc-800`}>
        
        {/* Placeholder Blur Skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-stone-300 dark:bg-zinc-800 flex items-center justify-center">
            <span className="text-xs font-mono opacity-40">Loading...</span>
          </div>
        )}

        {/* The Main Photo */}
        <img
          src={image.thumbnailUrl}
          alt={image.title}
          onLoad={() => setIsLoaded(true)}
          style={{ filter: filterStyle }}
          className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
            isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
          }`}
          loading="lazy"
        />

        {/* Top Floating Badge Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          
          {/* Category Tag */}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-medium tracking-wider uppercase bg-black/40 backdrop-blur-md text-white border border-white/20 shadow-xs pointer-events-auto">
            {image.category}
          </span>

          {/* Favorite Like Button */}
          <button
            onClick={(e) => onToggleLike(image.id, e)}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 pointer-events-auto shadow-sm ${
              image.isLiked
                ? 'bg-rose-500 text-white scale-105'
                : 'bg-black/40 hover:bg-black/60 text-white/80 hover:text-white border border-white/20'
            }`}
            title={image.isLiked ? 'Unlike photo' : 'Like photo'}
            id={`like-btn-${image.id}`}
          >
            <Heart className={`w-3.5 h-3.5 ${image.isLiked ? 'fill-white text-white' : ''}`} />
          </button>
        </div>

        {/* Hover Gradient Overlay & Info Box */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white z-10">
          
          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {/* Title & Zoom Indicator */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-sm font-semibold tracking-tight leading-snug font-serif">{image.title}</h3>
              <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm shrink-0">
                <Maximize2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Description Preview */}
            <p className="text-xs text-white/80 line-clamp-1 mb-2 font-sans font-normal">
              {image.description}
            </p>

            {/* Footer Metadata: Photographer & Location */}
            <div className="flex items-center justify-between text-[11px] text-white/70 pt-2 border-t border-white/15">
              <div className="flex items-center gap-2">
                <img
                  src={image.photographer.avatar}
                  alt={image.photographer.name}
                  className="w-4 h-4 rounded-full object-cover border border-white/30"
                />
                <span className="font-medium truncate max-w-[100px]">{image.photographer.name}</span>
              </div>

              {image.exif.location && (
                <div className="flex items-center gap-1 opacity-90 truncate max-w-[120px]">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{image.exif.location.split(',')[0]}</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
