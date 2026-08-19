/**
 * Image Filter & CSS Effect Utilities
 * Converts slider values and filter presets into browser CSS filter strings.
 */

import { FilterPreset, ImageAdjustments } from '../types';

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  grayscale: 0,
  sepia: 0,
  blur: 0,
  hueRotate: 0,
};

export const FILTER_PRESETS: Record<FilterPreset, { label: string; adjustments: ImageAdjustments }> = {
  normal: {
    label: 'Original',
    adjustments: { ...DEFAULT_ADJUSTMENTS },
  },
  grayscale: {
    label: 'Monochrome',
    adjustments: { ...DEFAULT_ADJUSTMENTS, grayscale: 100, contrast: 115 },
  },
  sepia: {
    label: 'Vintage Sepia',
    adjustments: { ...DEFAULT_ADJUSTMENTS, sepia: 80, brightness: 95, contrast: 105 },
  },
  warm: {
    label: 'Warm Sun',
    adjustments: { ...DEFAULT_ADJUSTMENTS, sepia: 25, saturation: 125, brightness: 105 },
  },
  cool: {
    label: 'Cool Teal',
    adjustments: { ...DEFAULT_ADJUSTMENTS, hueRotate: 180, saturation: 90, contrast: 110 },
  },
  contrast: {
    label: 'High Punch',
    adjustments: { ...DEFAULT_ADJUSTMENTS, contrast: 140, saturation: 120 },
  },
  vintage: {
    label: 'Matte Film',
    adjustments: { ...DEFAULT_ADJUSTMENTS, brightness: 105, contrast: 90, sepia: 30, saturation: 85 },
  },
  dramatic: {
    label: 'Noir Drama',
    adjustments: { ...DEFAULT_ADJUSTMENTS, grayscale: 100, contrast: 160, brightness: 90 },
  },
};

/**
 * Generates valid inline CSS filter string from adjustment properties
 */
export function getCssFilterString(adj: ImageAdjustments): string {
  const parts: string[] = [];
  
  if (adj.brightness !== 100) parts.push(`brightness(${adj.brightness}%)`);
  if (adj.contrast !== 100) parts.push(`contrast(${adj.contrast}%)`);
  if (adj.saturation !== 100) parts.push(`saturate(${adj.saturation}%)`);
  if (adj.grayscale > 0) parts.push(`grayscale(${adj.grayscale}%)`);
  if (adj.sepia > 0) parts.push(`sepia(${adj.sepia}%)`);
  if (adj.blur > 0) parts.push(`blur(${adj.blur}px)`);
  if (adj.hueRotate > 0) parts.push(`hue-rotate(${adj.hueRotate}deg)`);

  return parts.length > 0 ? parts.join(' ') : 'none';
}
