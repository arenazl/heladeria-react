import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { IMAGE_BASE_URL } from '../config/image.config';
import '../styles/ProductDetail.css';

interface RecommendedProductsProps {
  title: string;
  products: any[];
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ title, products }) => {
  const navigate = useNavigate();
  const { addToOrder } = useOrder();

  const handleAddRecommendedProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToOrder(product, 1);
      navigate('/cart');
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-section">
      <h3 className="recommendations-title">{title}</h3>
      <div className="recommendations-scroll">
        {products.map((product) => (
          product && product.id && (
            <div key={product.id} className="recommendation-card">
              <div className="recommendation-image-container">
                <img src={`${IMAGE_BASE_URL}${product.image}`} alt={product.name} className="recommendation-image" />
              </div>
              <div className="recommendation-details">
                <h4>{product.name}</h4>
                {
                  product.description ? (
                    <p className="recommendation-description">{product.description}</p>
                  ) : (
                    <p className="recommendation-description">Esta es la descripción de un producto excelente de calidad y que le recomendamos</p>
                  )
                }
                <div className="recommendation-price-action">
                  <span className="recommendation-price">$ {product.price.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  <button 
                    className="add-recommendation-button"
                    onClick={() => handleAddRecommendedProduct(product.id)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
