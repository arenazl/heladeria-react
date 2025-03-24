import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/data.service';
import QuantitySelector from './QuantitySelector';
import '../styles/AllProductsListing.css';

const AllProductsListing: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  // Check if data is loaded
  if (!dataService.isLoaded()) {
    return <div className="loading">Cargando productos...</div>;
  }

  const categories = dataService.getCategories();

  return (
    <div className="all-products-listing">
      {categories.map(category => (
        <div key={category.id} className="category-section">
          <h1 className="category-title">{category.name}</h1>
          
          {dataService.getSubcategoriesByCategoryId(category.id).map(subcategory => {
            const products = dataService.getProductsBySubcategoryId(subcategory.id);
            
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
                          <div onClick={(e) => e.stopPropagation()}>
                            <QuantitySelector 
                              productId={product.id} 
                              product={product}
                            />
                          </div>
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
