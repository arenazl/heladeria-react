import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/data.service';
import QuantitySelector from './QuantitySelector';
import '../styles/ProductListing.css';
import { IMAGE_BASE_URL } from '../config/image.config';
import { toProperCase } from '../services/data.service';

interface ProductListingProps {
  categoryId: number | null;
  selectedSubcategoryId: number | null;
}

const ProductListing: React.FC<ProductListingProps> = ({ categoryId, selectedSubcategoryId }) => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!categoryId) return null;
  
  const category = dataService.getCategoryById(categoryId);
  if (!category) return <div className="error-message">Categoría no encontrada</div>;

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  // If a subcategory is selected, show only products from that subcategory
  if (selectedSubcategoryId) {
    const subcategory = dataService.getSubcategoryById(selectedSubcategoryId);
    if (!subcategory) return <div className="error-message">Subcategoría no encontrada</div>;
    
    const products = dataService.getProductsBySubcategoryId(selectedSubcategoryId);
    
    return (
      <div className="product-listing">
<h2 className="subcategory-title">{toProperCase(subcategory.name)}</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image-container">
<img src={product.image ? (product.image.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image}`) : ''} alt={product.name} className="product-image" />
              </div>
              <div className="product-content">
                <h3 className="product-title">{product.name}</h3>
{
  product.description ? (
    <p className="product-description">{product.description}</p>
  ) : (
    <p className="product-description">Esta es una descripción del producto que es muy saludable y lo recomendamos para toda la familia</p>
  )
}
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
  }
  
  // If no subcategory is selected, group products by subcategory
  const subcategories = dataService.getSubcategoriesByCategoryId(categoryId);
  
  return (
    <div className="product-listing">
      {subcategories.map((subcategory) => {
        const products = dataService.getProductsBySubcategoryId(subcategory.id);
        
        return (
          <div key={subcategory.id} className="subcategory-section">
            <h2 className="subcategory-title">{subcategory.name}</h2>
            <div className="product-grid">
              {products.map((product) => (
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
  );
};

export default ProductListing;
