import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/mockData';
import '../styles/CategorySelection.css';

const CategorySelection: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/categories/${categoryId}/subcategories`);
  };

  return (
    <div className="page-container">
      <div className="section-container">
        <h2 className="section-title">Categorías</h2>
        <div className="grid-layout columns-4">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="card-image-container">
                <img src={category.image} alt={category.name} className="card-image" />
              </div>
              <div className="card-content">
                <h3 className="card-title">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;
