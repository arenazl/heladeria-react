import { dataService } from '../services/data.service';

// Base URL for the blob storage
export const BLOB_STORAGE_URL = "https://nucleocheckqa.blob.core.windows.net";

// Function to get the base URL for product images with the dynamic company name
export const getImageBaseUrl = (): string => {
  const companyName = dataService.getCompanyName();
  
  // If the company name is the default value ('Heladería'), use 'The Breakfast' instead
  // This handles the case when the data hasn't been loaded from the API yet
  const effectiveCompanyName = companyName === 'Heladería' ? 'The Breakfast' : companyName;
  
  return `${BLOB_STORAGE_URL}/images/${encodeURIComponent(effectiveCompanyName)}/products/`;
};

// Function to get the fallback image URL with the dynamic company name
export const getFallbackImageUrl = (): string => {
  const companyName = dataService.getCompanyName();
  
  // If the company name is the default value ('Heladería'), use 'The Breakfast' instead
  const effectiveCompanyName = companyName;
  
  return `${BLOB_STORAGE_URL}/images/${encodeURIComponent(effectiveCompanyName)}/placeholder.jpg`;
};

// Add a fallback image URL for when blob storage images fail to load
// Using a URL from the blob storage with the dynamic company name
export const FALLBACK_IMAGE_URL = getFallbackImageUrl();

// Flag to track if we've already tried to initialize the blob storage
let initializationAttempted = false;

// Flag to track if we've already logged the CORS warning
let corsWarningLogged = false;

/**
 * Checks if the blob storage exists and initializes it if it doesn't
 * Note: Due to CORS restrictions, this function may not be able to directly check the blob storage
 * @returns Promise<boolean> - true if the blob storage is assumed to exist, false otherwise
 */
export const checkAndInitializeBlobStorage = async (): Promise<boolean> => {
  // Simply return true since we're not doing fallback handling anymore
  return true;
};

/**
 * Check if the blob storage exists and initialize it if it doesn't
 * This function handles CORS errors gracefully and provides fallbacks
 */
export const initializeBlobStorage = async (): Promise<void> => {
  // Only attempt initialization once
  if (initializationAttempted) {
    return;
  }
  
  initializationAttempted = true;
  console.log('Blob storage initialization skipped - fallback handling disabled');
};

/**
 * Gets the product image URL
 * @param imagePath - The relative path of the image
 * @returns The complete URL to the image in the blob storage
 */
export const getProductImageUrl = (imagePath: string): string => {
  // If no image path is provided, return empty string
  if (!imagePath) return '';
  
  // If the image path already starts with http, it's already a complete URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, build the URL using the blob storage
  try {
    return `${getImageBaseUrl()}${imagePath}`;
  } catch (error) {
    console.error('Error building product image URL:', error);
    return '';
  }
};

/**
 * Simplified preload function that just returns the original URL
 * No fallback handling is performed
 * @param imageUrl - The URL of the image
 * @returns Promise<string> - The original URL
 */
export const preloadImage = (imageUrl: string): Promise<string> => {
  return Promise.resolve(imageUrl);
};
