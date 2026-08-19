/**
 * Types & Interfaces for the Image Gallery Application
 * Clean, descriptive, and strictly typed for maintainability.
 */

// Category types available for filtering
export type ImageCategory = 
  | 'All' 
  | 'Architecture' 
  | 'Nature' 
  | 'Minimalism' 
  | 'Street' 
  | 'Portrait' 
  | 'Abstract';

// Presets for visual CSS image filters (Bonus feature)
export type FilterPreset = 
  | 'normal'
  | 'grayscale'
  | 'sepia'
  | 'warm'
  | 'cool'
  | 'contrast'
  | 'vintage'
  | 'dramatic';

// Custom image adjustment sliders
export interface ImageAdjustments {
  brightness: number;  // Range: 50 - 150 (%)
  contrast: number;    // Range: 50 - 150 (%)
  saturation: number;  // Range: 0 - 200 (%)
  grayscale: number;   // Range: 0 - 100 (%)
  sepia: number;       // Range: 0 - 100 (%)
  blur: number;        // Range: 0 - 10 (px)
  hueRotate: number;   // Range: 0 - 360 (deg)
}

// Camera EXIF details for photography lovers
export interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  location?: string;
  dateTaken?: string;
}

// Full Image object representation
export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  category: ImageCategory;
  url: string;
  thumbnailUrl: string;
  aspectRatio: 'square' | 'portrait' | 'landscape' | 'wide';
  photographer: {
    name: string;
    avatar: string;
    handle: string;
  };
  exif: ExifData;
  tags: string[];
  likes: number;
  isLiked?: boolean;
  uploadedAt: string;
}

// View modes for gallery presentation
export type LayoutMode = 'grid' | 'masonry' | 'compact';

// Active lightbox state options
export interface LightboxState {
  isOpen: boolean;
  currentIndex: number;
  isSlideshowPlaying: boolean;
  slideshowInterval: number; // in milliseconds
  zoomLevel: number; // 1 to 3
}
