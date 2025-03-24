import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCategoryById, 
  getSubcategoriesByCategoryId, 
  getProductsBySubcategoryId,
  getSubcategoryById
} from '../data/mockData';
import QuantitySelector from './QuantitySelector';
import '../styles/ProductListing.css';

interface ProductListingProps {
  categoryId: number | null;
  selectedSubcategoryId: number | null;
}

const ProductListing: React.FC<ProductListingProps> = ({ categoryId, selectedSubcategoryId }) => {
  const navigate = useNavigate();
  
  if (!categoryId) return null;
  
  const category = getCategoryById(categoryId);
  if (!category) return <div className="error-message">Categoría no encontrada</div>;

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  // If a subcategory is selected, show only products from that subcategory
  if (selectedSubcategoryId) {
    const subcategory = getSubcategoryById(selectedSubcategoryId);
    if (!subcategory) return <div className="error-message">Subcategoría no encontrada</div>;
    
    const products = getProductsBySubcategoryId(selectedSubcategoryId);
    
    return (
      <div className="product-listing">
        <h2 className="subcategory-title">{subcategory.name}</h2>
        <div className="product-grid">
          {products.map((product) => (
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
  }
  
  // If no subcategory is selected, group products by subcategory
  const subcategories = getSubcategoriesByCategoryId(categoryId);
  
  return (
    <div className="product-listing">
      {subcategories.map((subcategory) => {
        const products = getProductsBySubcategoryId(subcategory.id);
        
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
  );
};

export default ProductListing;
