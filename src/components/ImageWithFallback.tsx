import React from 'react';
import { getProductImageUrl } from '../config/image.config';
import '../styles/ImageWithFallback.css';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
}

/**
 * A component that displays an image
 * If the image fails to load, nothing will be shown
 */
const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  style = {},
  width,
  height,
}) => {
  // Get the full URL for the image
  const imageSrc = src.startsWith('http') ? src : getProductImageUrl(src);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`image-with-fallback ${className}`}
      style={{
        ...style,
        width: width,
        height: height,
      }}
    />
  );
};

export default ImageWithFallback;
