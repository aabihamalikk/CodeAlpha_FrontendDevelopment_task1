/**
 * UploadModal Component
 * Allows users to import custom photos into the gallery via file selection or direct image URL.
 * Includes category selection, title, description, and camera metadata entry.
 */

import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { GalleryImage, ImageCategory } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddImage: (newImage: GalleryImage) => void;
  categories: ImageCategory[];
  isDarkMode: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddImage,
  categories,
  isDarkMode,
}) => {
  const [tab, setTab] = useState<'url' | 'file'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ImageCategory>('Architecture');
  const [camera, setCamera] = useState('');
  const [location, setLocation] = useState('');
  const [photographerName, setPhotographerName] = useState('You');
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  // Handle local file upload via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
          setPreviewError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !title) return;

    const newPhoto: GalleryImage = {
      id: `custom-${Date.now()}`,
      title,
      description: description || 'User uploaded photograph.',
      category,
      url: imageUrl,
      thumbnailUrl: imageUrl,
      aspectRatio: 'landscape',
      photographer: {
        name: photographerName || 'Anonymous',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        handle: '@user_creator',
      },
      exif: {
        camera: camera || 'Custom Camera',
        location: location || 'Personal Studio',
        dateTaken: new Date().toISOString().split('T')[0],
      },
      tags: [category, 'Custom', 'Personal'],
      likes: 1,
      isLiked: true,
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    onAddImage(newPhoto);
    onClose();

    // Reset form
    setImageUrl('');
    setTitle('');
    setDescription('');
    setCamera('');
    setLocation('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative ${
        isDarkMode 
          ? 'bg-zinc-950 border-zinc-800 text-zinc-100' 
          : 'bg-white border-stone-200 text-stone-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-zinc-800 mb-5">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold font-serif">Add Photo to Gallery</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
            id="close-upload-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: URL vs Local File */}
        <div className="flex items-center gap-2 mb-5 p-1 rounded-xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              tab === 'url'
                ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-stone-900 shadow-xs'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Image URL
          </button>
          <button
            type="button"
            onClick={() => setTab('file')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              tab === 'file'
                ? isDarkMode ? 'bg-zinc-800 text-white shadow-xs' : 'bg-white text-stone-900 shadow-xs'
                : 'opacity-60 hover:opacity-100'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Upload File
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {tab === 'url' ? (
            <div>
              <label className="block text-[11px] font-mono opacity-70 mb-1">IMAGE URL *</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewError(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none ${
                  isDarkMode 
                    ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-500' 
                    : 'bg-stone-50 border-stone-300 focus:border-stone-500'
                }`}
                id="upload-url-input"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-mono opacity-70 mb-1">CHOOSE LOCAL FILE</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer"
                id="upload-file-input"
              />
            </div>
          )}

          {/* Image Preview Box */}
          {imageUrl && (
            <div className="relative h-32 rounded-xl overflow-hidden bg-stone-200 dark:bg-zinc-900 border border-stone-300 dark:border-zinc-800 flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Preview"
                onError={() => setPreviewError(true)}
                className="w-full h-full object-cover"
              />
              {previewError && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-rose-400 font-mono">
                  Failed to load image preview
                </div>
              )}
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono opacity-70 mb-1">TITLE *</label>
              <input
                type="text"
                required
                placeholder="E.g., Golden Dusk"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                  isDarkMode 
                    ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-500' 
                    : 'bg-stone-50 border-stone-300 focus:border-stone-500'
                }`}
                id="upload-title-input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono opacity-70 mb-1">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ImageCategory)}
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                  isDarkMode 
                    ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-500 text-zinc-100' 
                    : 'bg-stone-50 border-stone-300 focus:border-stone-500 text-stone-900'
                }`}
                id="upload-category-select"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-mono opacity-70 mb-1">DESCRIPTION</label>
            <input
              type="text"
              placeholder="Short photo story or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                isDarkMode 
                  ? 'bg-zinc-900 border-zinc-800 focus:border-zinc-500' 
                  : 'bg-stone-50 border-stone-300 focus:border-stone-500'
              }`}
              id="upload-desc-input"
            />
          </div>

          {/* Optional EXIF Info */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-mono opacity-70 mb-1">CAMERA / DEVICE</label>
              <input
                type="text"
                placeholder="Fujifilm X100V, iPhone..."
                value={camera}
                onChange={(e) => setCamera(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
                  isDarkMode 
                    ? 'bg-zinc-900 border-zinc-800' 
                    : 'bg-stone-50 border-stone-300'
                }`}
                id="upload-camera-input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono opacity-70 mb-1">PHOTOGRAPHER</label>
              <input
                type="text"
                placeholder="Your Name"
                value={photographerName}
                onChange={(e) => setPhotographerName(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
                  isDarkMode 
                    ? 'bg-zinc-900 border-zinc-800' 
                    : 'bg-stone-50 border-stone-300'
                }`}
                id="upload-photographer-input"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium opacity-70 hover:opacity-100`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!imageUrl || !title || previewError}
              className={`px-5 py-2 rounded-xl text-xs font-semibold shadow-md transition-all ${
                isDarkMode 
                  ? 'bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40' 
                  : 'bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40'
              }`}
              id="submit-photo-btn"
            >
              Add to Gallery
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
