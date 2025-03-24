import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dataService } from '../services/data.service';
import { useOrder } from '../context/OrderContext';
import QuantitySelector from '../components/QuantitySelector';
import '../styles/ProductDetail.css';

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { order, addToOrder } = useOrder();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  
  const productIdNumber = productId ? parseInt(productId, 10) : 0;
  const product = dataService.getProductById(productIdNumber);
  
  // Check if this product is in the cart and get its quantity
  const existingItem = order.items.find(item => item.productId === productIdNumber);
  const currentQuantity = existingItem ? existingItem.quantity : 0;
  
  const handleContinueClick = () => {
    navigate('/products');
  };

  const handleAddRecommendedProduct = (productId: number) => {
    const product = dataService.getProductById(productId);
    if (product) {
      addToOrder(product, 1);
      navigate('/cart');
    }
  };

  useEffect(() => {
    if (product) {
      const relatedProducts = dataService.getRelatedProducts(product.id, 5);
      setRecommendations(relatedProducts);
    }
  }, [product]);

  if (!product) {
    return <div className="error-message">Producto no encontrado</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        <div className="product-detail-image-container">
          <img src={product.image} alt={product.name} className="product-detail-image" />
        </div>
        
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p className="product-detail-description">{product.description}</p>
          
          <div className="product-detail-actions">
            <p className="product-detail-price">$ {product.price.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <div className="product-detail-quantity">
              <QuantitySelector productId={product.id} product={product} />
            </div>
          </div>
          
          {currentQuantity > 0 && (
            <button 
              className="continue-button"
              onClick={handleContinueClick}
            >
              Volver al menu
            </button>
          )}
        </div>
      </div>
      
      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3 className="recommendations-title">Productos Relacionados</h3>
          <div className="recommendations-scroll">
            {recommendations.map((relatedProduct) => (
              relatedProduct && relatedProduct.id && (
                <div key={relatedProduct.id} className="recommendation-card">
                  <div className="recommendation-image-container">
                    <img src={relatedProduct.image} alt={relatedProduct.name} className="recommendation-image" />
                  </div>
                  <div className="recommendation-details">
                    <h4>{relatedProduct.name}</h4>
                    <p className="recommendation-description">{relatedProduct.description}</p>
                    <div className="recommendation-price-action">
                      <span className="recommendation-price">$ {relatedProduct.price.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                      <button 
                        className="add-recommendation-button"
                        onClick={() => handleAddRecommendedProduct(relatedProduct.id)}
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
      )}
    </div>
  );
};

export default ProductDetail;
