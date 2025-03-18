import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategoryById, getSubcategoriesByCategoryId } from '../data/mockData';
import '../styles/SubcategorySelection.css';

const SubcategorySelection: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const categoryIdNumber = categoryId ? parseInt(categoryId, 10) : 0;
  const category = getCategoryById(categoryIdNumber);
  const subcategories = getSubcategoriesByCategoryId(categoryIdNumber);

  const handleSubcategoryClick = (subcategoryId: number) => {
    navigate(`/subcategories/${subcategoryId}/products`);
  };

  if (!category) {
    return <div className="error-message">Categoría no encontrada</div>;
  }

  return (
    <div className="page-container">
      <div className="section-container">
        <h2 className="section-title">Subcategorías de {category.name}</h2>
        
        <div className="grid-layout columns-4">
          {subcategories.map((subcategory) => (
            <div 
              key={subcategory.id} 
              className="card"
              onClick={() => handleSubcategoryClick(subcategory.id)}
            >
              <div className="card-image-container">
                <img src={subcategory.image} alt={subcategory.name} className="card-image" />
              </div>
              <div className="card-content">
                <h3 className="card-title">{subcategory.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubcategorySelection;
