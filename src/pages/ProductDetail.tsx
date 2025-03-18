import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../data/mockData';
import { useOrder } from '../context/OrderContext';
import '../styles/ProductDetail.css';

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const { addToOrder } = useOrder();
  
  const [quantity, setQuantity] = useState(1);
  
  const productIdNumber = productId ? parseInt(productId, 10) : 0;
  const product = getProductById(productIdNumber);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToOrder = () => {
    if (product) {
      addToOrder(product, quantity);
      navigate('/quantity');
    }
  };

  if (!product) {
    return <div className="error-message">Producto no encontrado</div>;
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-container">
        <h1 className="section-title">Detalle del Producto</h1>
        <div className="product-detail-content">
          <div className="product-detail-image-container">
            <img src={product.image} alt={product.name} className="product-detail-image" />
          </div>
          
          <div className="product-detail-info">
            <h2>{product.name}</h2>
            <p className="product-detail-description">{product.description}</p>
            
            <div className="product-detail-actions">
              <p className="product-detail-price">${product.price}</p>
              <div className="quantity-selector">
                {quantity === 1 ? (
                  <button 
                    className="quantity-button trash-button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    🗑️
                  </button>
                ) : (
                  <button 
                    className="quantity-button"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                )}
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <button 
              className="add-to-order-button"
              onClick={handleAddToOrder}
            >
              Agregar al Pedido - ${product.price * quantity}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
