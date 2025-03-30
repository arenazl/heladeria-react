import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dataService } from '../services/data.service';
import { useOrder } from '../context/OrderContext';
import QuantitySelector from '../components/QuantitySelector';
import '../styles/ProductDetail.css';
import RecommendedProducts from '../components/RecommendedProducts';
import { IMAGE_BASE_URL } from '../config/image.config';

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
const excludedProductIds = [product.id, ...order.items.map(item => item.productId)];
const relatedProducts = dataService.getRelatedProducts(product.id, excludedProductIds);
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
<img src={product.image ? (product.image.startsWith('http') ? product.image : `${IMAGE_BASE_URL}${product.image}`) : ''} alt={product.name} className="product-detail-image" />
        </div>
        
        <div className="product-detail-info">
          <h2>{product.name}</h2>
{
  product.description ? (
    <p className="product-detail-description">{product.description}</p>
  ) : (
    <p className="product-detail-description">Esta es una descripción del producto que es muy saludable y lo recomendamos para toda la familia</p>
  )
}
          
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
      
<RecommendedProducts title="Productos Relacionados" products={recommendations} />
    </div>
  );
};

export default ProductDetail;
