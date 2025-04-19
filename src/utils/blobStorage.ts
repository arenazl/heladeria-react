/**
 * This file is kept for backward compatibility.
 * All functionality has been moved to image.config.ts to avoid circular dependencies.
 * 
 * Please import from image.config.ts directly instead of this file.
 */

import { 
  checkAndInitializeBlobStorage as checkAndInitBlobStorage,
  getProductImageUrl as getProductImageUrlFromConfig,
  preloadImage as preloadImageFromConfig
} from '../config/image.config';

// Re-export the functions for backward compatibility
export const checkAndInitializeBlobStorage = checkAndInitBlobStorage;
export const getProductImageUrl = getProductImageUrlFromConfig;
export const preloadImage = preloadImageFromConfig;
export const FALLBACK_IMAGE_URL = '';
