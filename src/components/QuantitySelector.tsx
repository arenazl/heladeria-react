import React, { useState, useEffect, useRef } from 'react';
import { useOrder } from '../context/OrderContext';
import { Product } from '../models/types';
import '../styles/QuantitySelector.css';

interface QuantitySelectorProps {
  productId: number;
  product: Product;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ productId, product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { addToOrder, updateQuantity, removeFromOrder, order } = useOrder();
  const selectorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    timeoutRef.current = setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    startTimer();
  };
  
  // Find if the product is already in the cart
  const existingItem = order.items.find(item => item.productId === productId);
  const currentQuantity = existingItem ? existingItem.quantity : 0;
  
  const handleOpen = () => {
    setIsAnimating(true);
    setIsExpanded(true);
    // If it's the first time being added, initialize with quantity 1
    if (currentQuantity === 0) {
      console.log('Adding product to cart:', product);
      addToOrder(product, 1);
      console.log('Product added to cart, new order:', order);
    }
  };
  
  const handleClose = () => {
    setIsAnimating(true);
    setIsExpanded(false);
    // Timer for animation
    setTimeout(() => setIsAnimating(false), 300); 
  };
  
  const handleIncrement = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent closing
    updateQuantity(productId, currentQuantity + 1);
    resetTimer();
  };
  
  const handleDecrement = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent closing
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
      resetTimer();
    } else {
      removeFromOrder(productId);
      setIsExpanded(false);
    }
  };

  // Handle clicks outside the component to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isExpanded]);
  
  return (
    <div 
      className={`quantity-selector ${isAnimating ? 'animating' : ''}`}
      ref={selectorRef}
    >
      {currentQuantity === 0 ? (
        <button 
          className="add-button"
          onMouseDown={handleOpen}
          onTouchStart={handleOpen}
          aria-label="Add to cart"
        >
          +
        </button>
      ) : isExpanded ? (
        <div 
          className="quantity-controls"
          onMouseLeave={handleClose}
        >
          <button 
            className="decrement-button"
            onClick={handleDecrement}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="quantity-display">{currentQuantity}</span>
          <button 
            className="increment-button"
            onClick={handleIncrement}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      ) : (
        <div 
          className="quantity-badge"
          onMouseDown={handleOpen}
          onTouchStart={handleOpen}
        >
          {currentQuantity}
        </div>
      )}
    </div>
  );
};

export default QuantitySelector;
