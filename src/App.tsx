/**
 * Main Application Entry Component
 * Coordinates state management for gallery images, category filtering, search queries,
 * live CSS filter adjustments, lightbox navigation, theme switching, and photo uploads.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { FilterPanel } from './components/FilterPanel';
import { GalleryGrid } from './components/GalleryGrid';
import { LightboxModal } from './components/LightboxModal';
import { UploadModal } from './components/UploadModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Footer } from './components/Footer';

import { GalleryImage, ImageCategory, LayoutMode, FilterPreset, ImageAdjustments } from './types';
import { INITIAL_IMAGES } from './data/sampleImages';
import { FILTER_PRESETS, DEFAULT_ADJUSTMENTS } from './utils/imageFilters';

const CATEGORIES: ImageCategory[] = [
  'All',
  'Architecture',
  'Nature',
  'Minimalism',
  'Street',
  'Portrait',
  'Abstract',
];

export default function App() {
  // 1. Gallery State with localStorage persistence for user interactions
  const [images, setImages] = useState<GalleryImage[]>(() => {
    const saved = localStorage.getItem('aura_gallery_images');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_IMAGES;
      }
    }
    return INITIAL_IMAGES;
  });

  // Persist images array on changes (for likes and uploads)
  useEffect(() => {
    localStorage.setItem('aura_gallery_images', JSON.stringify(images));
  }, [images]);

  // 2. Filter & Navigation States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ImageCategory>('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');

  // 3. Live Image Filter / Preset States
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activePreset, setActivePreset] = useState<FilterPreset>('normal');
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);

  // 4. Modal & Overlay States
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // 5. Theme State (Dark / Light)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('aura_theme');
    return savedTheme ? savedTheme === 'dark' : true; // Default dark minimalist
  });

  useEffect(() => {
    localStorage.setItem('aura_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Compute category photo counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    images.forEach((img) => {
      counts[img.category] = (counts[img.category] || 0) + 1;
    });
    return counts;
  }, [images]);

  // Filter images according to active search, category, and favorite toggle
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      // Favorites filter
      if (showOnlyFavorites && !img.isLiked) return false;

      // Category filter
      if (activeCategory !== 'All' && img.category !== activeCategory) return false;

      // Search query filter (matches title, description, tags, photographer, location, camera)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = img.title.toLowerCase().includes(q);
        const matchesDesc = img.description.toLowerCase().includes(q);
        const matchesTags = img.tags.some((t) => t.toLowerCase().includes(q));
        const matchesPhotographer = img.photographer.name.toLowerCase().includes(q);
        const matchesLocation = img.exif.location?.toLowerCase().includes(q) || false;
        const matchesCamera = img.exif.camera?.toLowerCase().includes(q) || false;

        return matchesTitle || matchesDesc || matchesTags || matchesPhotographer || matchesLocation || matchesCamera;
      }

      return true;
    });
  }, [images, activeCategory, showOnlyFavorites, searchQuery]);

  // Handle Like / Favorite Toggle
  const handleToggleLike = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === imageId) {
          const nextLiked = !img.isLiked;
          return {
            ...img,
            isLiked: nextLiked,
            likes: nextLiked ? img.likes + 1 : Math.max(0, img.likes - 1),
          };
        }
        return img;
      })
    );
  };

  // Preset Selection Handler
  const handleSelectPreset = (presetKey: FilterPreset) => {
    setActivePreset(presetKey);
    setAdjustments(FILTER_PRESETS[presetKey].adjustments);
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setActivePreset('normal');
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setSearchQuery('');
    setActiveCategory('All');
    setShowOnlyFavorites(false);
  };

  // Add User Uploaded Image Handler
  const handleAddImage = (newImage: GalleryImage) => {
    setImages((prev) => [newImage, ...prev]);
  };

  const likedCount = useMemo(() => images.filter((i) => i.isLiked).length, [images]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200' 
        : 'bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-stone-50'
    }`}>
      
      {/* Primary Sticky Header */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        layoutMode={layoutMode}
        onLayoutChange={setLayoutMode}
        showOnlyFavorites={showOnlyFavorites}
        onToggleFavorites={() => setShowOnlyFavorites((prev) => !prev)}
        favoritesCount={likedCount}
        showFilterPanel={showFilterPanel}
        onToggleFilterPanel={() => setShowFilterPanel((prev) => !prev)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto">
        
        {/* Category Pill Filters Bar */}
        <CategoryBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categoryCounts={categoryCounts}
          totalImagesCount={images.length}
          isDarkMode={isDarkMode}
        />

        {/* Live CSS Image Effects & Adjustments Panel */}
        {showFilterPanel && (
          <FilterPanel
            activePreset={activePreset}
            onSelectPreset={handleSelectPreset}
            adjustments={adjustments}
            onChangeAdjustments={(adj) => {
              setAdjustments(adj);
              setActivePreset('normal'); // Reset preset highlight when custom slider moves
            }}
            onResetFilters={() => {
              setActivePreset('normal');
              setAdjustments(DEFAULT_ADJUSTMENTS);
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Photo Gallery Grid */}
        <GalleryGrid
          images={filteredImages}
          onOpenLightbox={(index) => setLightboxIndex(index)}
          onToggleLike={handleToggleLike}
          adjustments={adjustments}
          layoutMode={layoutMode}
          isDarkMode={isDarkMode}
          onResetFilters={handleResetFilters}
        />

      </main>

      {/* Lightbox Modal Overlay */}
      <LightboxModal
        isOpen={lightboxIndex >= 0}
        images={filteredImages}
        currentIndex={lightboxIndex >= 0 ? lightboxIndex : 0}
        onClose={() => setLightboxIndex(-1)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        onToggleLike={handleToggleLike}
        adjustments={adjustments}
        isDarkMode={isDarkMode}
      />

      {/* Custom Upload Photo Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAddImage={handleAddImage}
        categories={CATEGORIES}
        isDarkMode={isDarkMode}
      />

      {/* Keyboard Shortcuts Help Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Footer */}
      <Footer
        totalCount={images.length}
        filteredCount={filteredImages.length}
        likedCount={likedCount}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}
