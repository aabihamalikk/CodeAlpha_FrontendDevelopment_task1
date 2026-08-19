/**
 * ShortcutsModal Component
 * Displays keyboard shortcuts guide for gallery navigation.
 */

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '← / →', description: 'Navigate to Previous / Next photo in Lightbox' },
    { key: 'Space', description: 'Play / Pause automatic slideshow' },
    { key: 'Escape', description: 'Close Lightbox or active modal' },
    { key: '+ / -', description: 'Zoom In / Zoom Out in Lightbox view' },
    { key: 'I', description: 'Toggle camera EXIF metadata drawer' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
        isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-stone-200 text-stone-900'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-zinc-800 mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold font-serif">Keyboard Shortcuts</h2>
          </div>
          <button onClick={onClose} className="p-1 opacity-60 hover:opacity-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 font-sans">
          {shortcuts.map((item) => (
            <div key={item.key} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 dark:border-zinc-900">
              <span className="opacity-70">{item.description}</span>
              <kbd className={`px-2 py-1 rounded font-mono font-semibold text-[11px] shadow-2xs ${
                isDarkMode ? 'bg-zinc-800 text-zinc-200 border border-zinc-700' : 'bg-stone-100 text-stone-800 border border-stone-300'
              }`}>
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3 text-center">
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-semibold ${
              isDarkMode ? 'bg-zinc-100 text-zinc-950 hover:bg-white' : 'bg-stone-900 text-stone-50 hover:bg-stone-800'
            }`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
