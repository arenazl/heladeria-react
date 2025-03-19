import React from 'react';
import { getSubcategoriesByCategoryId } from '../data/mockData';
import '../styles/SubcategoryBar.css';

// Custom icons for each subcategory
const getSubcategoryIcon = (subcategoryId: number, isActive: boolean) => {
  const color = isActive ? '#ffffff' : '#26b4bd';
  
  // Different icons based on subcategory ID
  switch(subcategoryId) {
    // Helados subcategories (1-4)
    case 1: // Helados de Crema
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 17v4M8 3v4M16 3v4M3 7h18M5 7v7a7 7 0 0 0 14 0V7"/>
        </svg>
      );
    case 2: // Helados de Agua
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2h8M8 2v2M16 2v2M3 7h18M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7"/>
        </svg>
      );
    case 3: // Helados Especiales
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v10M17.5 7.5 12 3 6.5 7.5M7 17h10M16 17l1 4H7l1-4"/>
        </svg>
      );
    case 4: // Helados Sin Azúcar
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
        </svg>
      );
      
    // Postres subcategories (5-6)
    case 5: // Tortas Heladas
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10h18M3 14h18M5 18h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z"/>
        </svg>
      );
    case 6: // Copas Heladas
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 21h8M12 21V7M5 3l14 4"/>
        </svg>
      );
      
    // Bebidas subcategories (7-8)
    case 7: // Licuados
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 3v4M19 3v4M5 7h14M9 7v14h6V7"/>
        </svg>
      );
    case 8: // Gaseosas
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2h8M8 2v2M16 2v2M3 7h18M5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7M12 12v5"/>
        </svg>
      );
      
    // Cafetería subcategories (9-10)
    case 9: // Cafés Especiales
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/>
        </svg>
      );
    case 10: // Tés y Infusiones
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 7h10M7 7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
        </svg>
      );
      
    // Snacks subcategories (11)
    case 11: // Bocadillos Salados
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 13v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4M15 6h1a2 2 0 0 1 2 2v3H6V8a2 2 0 0 1 2-2h1"/>
        </svg>
      );
      
    // Default icon for "Todos" or any other subcategory
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      );
  }
};

interface SubcategoryBarProps {
  categoryId: number | null;
  selectedSubcategoryId: number | null;
  onSubcategorySelect: (subcategoryId: number | null) => void;
}

const SubcategoryBar: React.FC<SubcategoryBarProps> = ({ 
  categoryId, 
  selectedSubcategoryId, 
  onSubcategorySelect 
}) => {
  if (!categoryId) return null;

  const subcategories = getSubcategoriesByCategoryId(categoryId);

  return (
    <div className="subcategory-bar">
      <div 
        className={`subcategory-item ${selectedSubcategoryId === null ? 'active' : ''}`}
        onClick={() => onSubcategorySelect(null)}
      >
        <span className="subcategory-icon">
          {getSubcategoryIcon(0, selectedSubcategoryId === null)}
        </span>
        <span className="subcategory-name">Todos</span>
      </div>
      
      {subcategories.map((subcategory) => {
        const isActive = selectedSubcategoryId === subcategory.id;
        return (
          <div 
            key={subcategory.id} 
            className={`subcategory-item ${isActive ? 'active' : ''}`}
            onClick={() => onSubcategorySelect(subcategory.id)}
          >
            <span className="subcategory-icon">
              {getSubcategoryIcon(subcategory.id, isActive)}
            </span>
            <span className="subcategory-name">{subcategory.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default SubcategoryBar;
