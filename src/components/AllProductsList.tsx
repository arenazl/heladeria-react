import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/data.service';
import { Category } from '../models/types';
import QuantitySelector from './QuantitySelector';
import '../styles/AllProductsListing.css';
import { IMAGE_BASE_URL } from '../config/image.config';
import { toProperCase } from '../services/data.service';

const AllProductsList: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get categories from data service
    setCategories(dataService.getCategories());
    setLoading(false);
  }, []);

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="all-products-listing">
      {categories.map(category => (
        <div key={category.id} className="category-section">
<h1 className="category-title">{toProperCase(category.name)}</h1>
          
          {dataService.getSubcategoriesByCategoryId(category.id).map(subcategory => {
            const products = dataService.getProductsBySubcategoryId(subcategory.id);
            
            if (products.length === 0) return null;
            
            return (
              <div key={subcategory.id} className="subcategory-section">
<h2 className="subcategory-title">{toProperCase(subcategory.name)}</h2>
                <div className="product-grid">
                  {products.map(product => (
                    <div 
                      key={product.id} 
                      className="product-card"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="product-image-container">
<img src={`${IMAGE_BASE_URL}${product.image}`} alt={product.name} className="product-image" />
                      </div>
                      <div className="product-content">
                        <h3 className="product-title">{product.name}</h3>
                        {
                          product.description ? (
                            <p className="product-description">{product.description}</p>
                          ) : (
                            <p className="product-description">Esta es la descripción de un producto excelente de calidad y que le recomendamos</p>
                          )
                        }
                        <div className="product-footer">
                          <p className="product-price">${product.price.toFixed(2)}</p>
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

export default AllProductsList;
