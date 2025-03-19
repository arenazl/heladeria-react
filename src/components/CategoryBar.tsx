import React from 'react';
import { categories } from '../data/mockData';
import '../styles/CategoryBar.css';

// Custom icons for each category
const getCategoryIcon = (categoryId: number, isActive: boolean) => {
  const color = isActive ? '#ffffff' : '#26b4bd';
  
  switch(categoryId) {
    case 1: // Helados
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 17v4M8 3v4M16 3v4M3 7h18M5 7v7a7 7 0 0 0 14 0V7"/>
        </svg>
      );
    case 2: // Postres
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3v3a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V3M4 11h16a1 1 0 0 1 1 1v.5c0 1.5-1.1 2.5-2 2.5H5c-.9 0-2-1-2-2.5V12a1 1 0 0 1 1-1Z"/>
          <path d="M6 15v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"/>
        </svg>
      );
    case 3: // Bebidas
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2h8M8 2v2M16 2v2M3 7h18M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7M12 12v5"/>
        </svg>
      );
    case 4: // Cafetería
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
        </svg>
      );
    case 5: // Snacks
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 13v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4M15 6h1a2 2 0 0 1 2 2v3H6V8a2 2 0 0 1 2-2h1"/>
          <path d="M10 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
      );
  }
};

interface CategoryBarProps {
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategoryId, onCategorySelect }) => {
  return (
    <div className="category-bar">
      {categories.map((category) => {
        const isActive = selectedCategoryId === category.id;
        return (
          <div 
            key={category.id} 
            className={`category-item ${isActive ? 'active' : ''}`}
            onClick={() => onCategorySelect(category.id)}
          >
            <div className="category-icon">
              {getCategoryIcon(category.id, isActive)}
            </div>
            <span className="category-name">{category.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBar;
