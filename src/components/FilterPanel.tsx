/**
 * FilterPanel Component
 * Provides real-time CSS image manipulation controls and presets.
 * Users can apply filters live across the entire gallery grid or reset anytime.
 */

import React from 'react';
import { Sliders, RotateCcw } from 'lucide-react';
import { FilterPreset, ImageAdjustments } from '../types';
import { FILTER_PRESETS, DEFAULT_ADJUSTMENTS } from '../utils/imageFilters';

interface FilterPanelProps {
  activePreset: FilterPreset;
  onSelectPreset: (preset: FilterPreset) => void;
  adjustments: ImageAdjustments;
  onChangeAdjustments: (adj: ImageAdjustments) => void;
  onResetFilters: () => void;
  isDarkMode: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  activePreset,
  onSelectPreset,
  adjustments,
  onChangeAdjustments,
  onResetFilters,
  isDarkMode,
}) => {
  // Helper to handle individual slider updates
  const handleSliderChange = (key: keyof ImageAdjustments, value: number) => {
    onChangeAdjustments({
      ...adjustments,
      [key]: value,
    });
  };

  const isCustomized = JSON.stringify(adjustments) !== JSON.stringify(DEFAULT_ADJUSTMENTS);

  return (
    <div className={`mx-4 sm:mx-6 lg:mx-8 mb-6 p-4 rounded-2xl border transition-all ${
      isDarkMode 
        ? 'bg-zinc-900/60 border-zinc-800/80 text-zinc-200' 
        : 'bg-white/80 border-stone-200/90 text-stone-800'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-dashed border-stone-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-semibold tracking-wide font-mono uppercase">Live CSS Image Filters</h3>
        </div>
        
        {isCustomized && (
          <button
            onClick={onResetFilters}
            className="text-[11px] font-mono flex items-center gap-1 opacity-70 hover:opacity-100 text-rose-500 transition-opacity"
            id="reset-filters-btn"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Defaults
          </button>
        )}
      </div>

      {/* Filter Presets Pills */}
      <div className="mb-4">
        <label className="block text-[11px] font-mono opacity-60 mb-2">QUICK PRESETS</label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(Object.keys(FILTER_PRESETS) as FilterPreset[]).map((presetKey) => {
            const preset = FILTER_PRESETS[presetKey];
            const isActive = activePreset === presetKey;

            return (
              <button
                key={presetKey}
                onClick={() => onSelectPreset(presetKey)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? isDarkMode
                      ? 'bg-amber-500 text-zinc-950 font-semibold shadow-xs'
                      : 'bg-amber-600 text-white font-semibold shadow-xs'
                    : isDarkMode
                      ? 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
                id={`preset-btn-${presetKey}`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
        
        {/* Brightness */}
        <div>
          <div className="flex justify-between text-[11px] font-mono opacity-70 mb-1">
            <span>Brightness</span>
            <span>{adjustments.brightness}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={adjustments.brightness}
            onChange={(e) => handleSliderChange('brightness', Number(e.target.value))}
            className="w-full accent-amber-500 h-1 bg-stone-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            id="slider-brightness"
          />
        </div>

        {/* Contrast */}
        <div>
          <div className="flex justify-between text-[11px] font-mono opacity-70 mb-1">
            <span>Contrast</span>
            <span>{adjustments.contrast}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            value={adjustments.contrast}
            onChange={(e) => handleSliderChange('contrast', Number(e.target.value))}
            className="w-full accent-amber-500 h-1 bg-stone-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            id="slider-contrast"
          />
        </div>

        {/* Saturation */}
        <div>
          <div className="flex justify-between text-[11px] font-mono opacity-70 mb-1">
            <span>Saturate</span>
            <span>{adjustments.saturation}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={adjustments.saturation}
            onChange={(e) => handleSliderChange('saturation', Number(e.target.value))}
            className="w-full accent-amber-500 h-1 bg-stone-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            id="slider-saturation"
          />
        </div>

        {/* Grayscale */}
        <div>
          <div className="flex justify-between text-[11px] font-mono opacity-70 mb-1">
            <span>Grayscale</span>
            <span>{adjustments.grayscale}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustments.grayscale}
            onChange={(e) => handleSliderChange('grayscale', Number(e.target.value))}
            className="w-full accent-amber-500 h-1 bg-stone-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            id="slider-grayscale"
          />
        </div>

        {/* Sepia */}
        <div>
          <div className="flex justify-between text-[11px] font-mono opacity-70 mb-1">
            <span>Sepia</span>
            <span>{adjustments.sepia}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustments.sepia}
            onChange={(e) => handleSliderChange('sepia', Number(e.target.value))}
            className="w-full accent-amber-500 h-1 bg-stone-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            id="slider-sepia"
          />
        </div>

        {/* Blur */}
        <div>
          <div className="flex justify-between text-[11px] font-mono opacity-70 mb-1">
            <span>Blur</span>
            <span>{adjustments.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={adjustments.blur}
            onChange={(e) => handleSliderChange('blur', Number(e.target.value))}
            className="w-full accent-amber-500 h-1 bg-stone-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            id="slider-blur"
          />
        </div>

      </div>
    </div>
  );
};
