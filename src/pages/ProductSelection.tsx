import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubcategoryById, getProductsBySubcategoryId } from '../data/mockData';
import '../styles/ProductSelection.css';

const ProductSelection: React.FC = () => {
  const navigate = useNavigate();
  const { subcategoryId } = useParams<{ subcategoryId: string }>();
  
  const subcategoryIdNumber = subcategoryId ? parseInt(subcategoryId, 10) : 0;
  const subcategory = getSubcategoryById(subcategoryIdNumber);
  const products = getProductsBySubcategoryId(subcategoryIdNumber);

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  if (!subcategory) {
    return <div className="error-message">Subcategoría no encontrada</div>;
  }

  return (
    <div className="page-container">
      <div className="section-container">
        <h2 className="section-title">Productos de {subcategory.name}</h2>
        
        <div className="grid-layout columns-3">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="card-image-container">
                <img src={product.image} alt={product.name} className="card-image" />
              </div>
              <div className="card-content">
                <h3 className="card-title">{product.name}</h3>
                <p className="card-description">{product.description}</p>
                <div className="card-footer">
                  <p className="card-price">${product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSelection;
