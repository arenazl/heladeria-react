import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  categories, 
  getSubcategoriesByCategoryId, 
  getProductsBySubcategoryId 
} from '../data/mockData';
import '../styles/AllProductsListing.css';

const AllProductsListing: React.FC = () => {
  const navigate = useNavigate();

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="all-products-listing">
      {categories.map(category => (
        <div key={category.id} className="category-section">
          <h1 className="category-title">{category.name}</h1>
          
          {getSubcategoriesByCategoryId(category.id).map(subcategory => {
            const products = getProductsBySubcategoryId(subcategory.id);
            
            if (products.length === 0) return null;
            
            return (
              <div key={subcategory.id} className="subcategory-section">
                <h2 className="subcategory-title">{subcategory.name}</h2>
                <div className="product-grid">
                  {products.map(product => (
                    <div 
                      key={product.id} 
                      className="product-card"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="product-image-container">
                        <img src={product.image} alt={product.name} className="product-image" />
                      </div>
                      <div className="product-content">
                        <h3 className="product-title">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <div className="product-footer">
                          <p className="product-price">${product.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AllProductsListing;
