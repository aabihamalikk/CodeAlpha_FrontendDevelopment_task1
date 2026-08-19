/**
 * LightboxModal Component
 * Implements full-screen photo viewing experience:
 * - Next & Previous navigation buttons
 * - Keyboard listeners (Left/Right arrows, Escape, Space to play/pause slideshow)
 * - Interactive EXIF camera metadata drawer
 * - Interactive Zoom & Pan controls
 * - Slideshow autoplay controls with speed settings
 * - Share, Download, and Like actions
 * - Live filter adjustment updates
 */

import React, { useEffect, useState, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Heart, 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  Info, 
  Download, 
  Share2, 
  MapPin, 
  Calendar, 
  Camera, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { GalleryImage, ImageAdjustments } from '../types';
import { getCssFilterString } from '../utils/imageFilters';

interface LightboxModalProps {
  isOpen: boolean;
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onToggleLike: (imageId: string, e: React.MouseEvent) => void;
  adjustments: ImageAdjustments;
  isDarkMode: boolean;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
  onToggleLike,
  adjustments,
  isDarkMode,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showExifDrawer, setShowExifDrawer] = useState(false);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);
  const [slideshowSpeed, setSlideshowSpeed] = useState(4000); // 4 seconds default
  const [isCopied, setIsCopied] = useState(false);

  const currentImage = images[currentIndex];

  // Reset zoom & drawer state when changing image
  useEffect(() => {
    setZoomLevel(1);
  }, [currentIndex]);

  // Handle Next Navigation safely
  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    const nextIdx = (currentIndex + 1) % images.length;
    onNavigate(nextIdx);
  }, [currentIndex, images.length, onNavigate]);

  // Handle Previous Navigation safely
  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    onNavigate(prevIdx);
  }, [currentIndex, images.length, onNavigate]);

  // Automatic Slideshow Timer Effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isOpen && isPlayingSlideshow) {
      timer = setInterval(() => {
        handleNext();
      }, slideshowSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, isPlayingSlideshow, slideshowSpeed, handleNext]);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowRight':
          handleNext();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'Escape':
          onClose();
          break;
        case ' ':
          e.preventDefault();
          setIsPlayingSlideshow((prev) => !prev);
          break;
        case 'i':
        case 'I':
          setShowExifDrawer((prev) => !prev);
          break;
        case '+':
        case '=':
          setZoomLevel((prev) => Math.min(prev + 0.5, 3));
          break;
        case '-':
        case '_':
          setZoomLevel((prev) => Math.max(prev - 0.5, 1));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Copy share URL trigger
  const handleShare = () => {
    if (!currentImage) return;
    navigator.clipboard.writeText(currentImage.url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download Image Helper
  const handleDownload = () => {
    if (!currentImage) return;
    const a = document.createElement('a');
    a.href = currentImage.url;
    a.download = `${currentImage.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen || !currentImage) return null;

  const filterStyle = getCssFilterString(adjustments);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-300 select-none">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between text-white z-20 bg-gradient-to-b from-black/80 to-transparent">
        
        {/* Left Side: Counter & Title */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            {currentIndex + 1} / {images.length}
          </span>
          <div className="hidden sm:block">
            <h2 className="text-sm font-semibold tracking-tight font-serif truncate max-w-xs">{currentImage.title}</h2>
            <p className="text-[11px] text-white/60 font-mono">{currentImage.category}</p>
          </div>
        </div>

        {/* Right Side Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Zoom In/Out */}
          <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-0.5 border border-white/15">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 1))}
              disabled={zoomLevel <= 1}
              className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 transition-opacity"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-2">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 3))}
              disabled={zoomLevel >= 3}
              className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 transition-opacity"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Slideshow Play/Pause */}
          <button
            onClick={() => setIsPlayingSlideshow((prev) => !prev)}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors border border-white/15 ${
              isPlayingSlideshow ? 'bg-amber-500 text-black font-semibold' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={isPlayingSlideshow ? 'Pause Slideshow (Space)' : 'Play Slideshow (Space)'}
            id="lightbox-slideshow-btn"
          >
            {isPlayingSlideshow ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* EXIF Info Drawer Toggle */}
          <button
            onClick={() => setShowExifDrawer((prev) => !prev)}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors border border-white/15 ${
              showExifDrawer ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Toggle Photo Details (I)"
            id="lightbox-info-btn"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Favorite Like Toggle */}
          <button
            onClick={(e) => onToggleLike(currentImage.id, e)}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors border border-white/15 ${
              currentImage.isLiked ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title={currentImage.isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${currentImage.isLiked ? 'fill-white' : ''}`} />
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors border border-white/15 text-white"
            title="Download Image"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors border border-white/15 text-white"
            title="Copy Image URL"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 backdrop-blur-md transition-colors border border-white/15 text-white ml-2"
            title="Close Lightbox (Esc)"
            id="lightbox-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

        </div>
      </div>

      {/* Prev Button (Left) */}
      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-lg"
        title="Previous Photo (Left Arrow)"
        id="lightbox-prev-btn"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Button (Right) */}
      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-lg"
        title="Next Photo (Right Arrow)"
        id="lightbox-next-btn"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Display Stage */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-hidden">
        <div 
          className="transition-transform duration-300 ease-out flex items-center justify-center max-w-full max-h-full"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={currentImage.url}
            alt={currentImage.title}
            style={{ filter: filterStyle }}
            className="max-h-[82vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-all duration-300"
          />
        </div>
      </div>

      {/* EXIF Information Sidebar / Drawer */}
      {showExifDrawer && (
        <div className="absolute right-0 top-20 bottom-24 w-80 bg-zinc-950/90 backdrop-blur-2xl border-l border-zinc-800 p-6 z-30 text-white overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-semibold tracking-tight font-serif flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" />
              Photo Metadata
            </h3>
            <button
              onClick={() => setShowExifDrawer(false)}
              className="text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>

          {/* Title & Description */}
          <div className="mb-6">
            <h4 className="text-base font-medium font-serif mb-1">{currentImage.title}</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{currentImage.description}</p>
          </div>

          {/* Photographer Info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 mb-6">
            <img
              src={currentImage.photographer.avatar}
              alt={currentImage.photographer.name}
              className="w-10 h-10 rounded-full object-cover border border-zinc-700"
            />
            <div>
              <div className="text-xs font-semibold">{currentImage.photographer.name}</div>
              <div className="text-[11px] font-mono text-zinc-500">{currentImage.photographer.handle}</div>
            </div>
          </div>

          {/* EXIF Technical Details */}
          <div className="space-y-3 text-xs font-sans mb-6">
            {currentImage.exif.camera && (
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" /> Camera
                </span>
                <span className="font-mono text-zinc-200">{currentImage.exif.camera}</span>
              </div>
            )}

            {currentImage.exif.lens && (
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                <span className="text-zinc-500">Lens</span>
                <span className="font-mono text-zinc-200">{currentImage.exif.lens}</span>
              </div>
            )}

            {currentImage.exif.aperture && (
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                <span className="text-zinc-500">Aperture</span>
                <span className="font-mono text-zinc-200">{currentImage.exif.aperture}</span>
              </div>
            )}

            {currentImage.exif.shutterSpeed && (
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                <span className="text-zinc-500">Shutter</span>
                <span className="font-mono text-zinc-200">{currentImage.exif.shutterSpeed}</span>
              </div>
            )}

            {currentImage.exif.iso && (
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                <span className="text-zinc-500">ISO</span>
                <span className="font-mono text-zinc-200">{currentImage.exif.iso}</span>
              </div>
            )}

            {currentImage.exif.location && (
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </span>
                <span className="font-sans text-zinc-200">{currentImage.exif.location}</span>
              </div>
            )}

            {currentImage.exif.dateTaken && (
              <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/80">
                <span className="text-zinc-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Shot Date
                </span>
                <span className="font-mono text-zinc-200">{currentImage.exif.dateTaken}</span>
              </div>
            )}
          </div>

          {/* Tags list */}
          <div>
            <span className="block text-[11px] font-mono text-zinc-500 mb-2">TAGS</span>
            <div className="flex flex-wrap gap-1.5">
              {currentImage.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Thumbnail Strip Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
        <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto overflow-x-auto no-scrollbar py-1">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => onNavigate(idx)}
              className={`relative shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all duration-200 ${
                idx === currentIndex
                  ? 'ring-2 ring-white scale-110 opacity-100 shadow-lg'
                  : 'opacity-40 hover:opacity-80 scale-95'
              }`}
            >
              <img src={img.thumbnailUrl} alt={img.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
