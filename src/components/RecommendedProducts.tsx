import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import ImageWithFallback from './ImageWithFallback';
import '../styles/RecommendedProducts.css';

interface RecommendedProductsProps {
  title: string;
  products: any[];
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ title, products }) => {
  const navigate = useNavigate();
  const { addToOrder } = useOrder();
  const [fadingProducts, setFadingProducts] = useState<{[key: number]: boolean}>({});

  const handleAddRecommendedProduct = (productId: number, event: React.MouseEvent) => {
    // Prevenimos el comportamiento predeterminado
    event.preventDefault();
    event.stopPropagation();
    
    console.log("Iniciando animación para producto:", productId);
    
    // Primero activamos el efecto de fade out
    setFadingProducts(prev => ({...prev, [productId]: true}));
    
    // Buscamos el producto
    const product = products.find(p => p.id === productId);
    if (product) {
      // Esperamos a que termine la animación antes de agregar al carrito y navegar
      setTimeout(() => {
        console.log("Animación completada, agregando producto al carrito:", productId);
        // Añadimos el producto al carrito después de la animación
        addToOrder(product, 1);
        
        // Navegamos a la página del carrito
        navigate('/cart');
      }, 400); // 1000ms para la animación de fade out
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-section">
      <h3 className="recommendations-title">{title}</h3>
      <div className="recommendations-scroll">
        {products.map((product, index) => (
          product && product.id && (
            <div 
              key={product.id} 
              className={`recommendation-card ${fadingProducts[product.id] ? 'fading-out' : ''}`}
              style={{ '--card-index': index } as React.CSSProperties}
            >
              {/* Parte superior: Imagen a la izquierda y textos a la derecha */}
              <div className="recommendation-top">
                <div className="recommendation-image-container">
                  <ImageWithFallback 
                    src={product.image || ''} 
                    alt={product.name} 
                    className="recommendation-image"
                  />
                </div>
                <div className="recommendation-header">
                  <h4 className="recommendation-title">{product.name}</h4>
                  <p className="recommendation-description">
                    {product.description 
                      ? (product.description.length > 60
                          ? product.description.substring(0, 60) + "..." 
                          : product.description)
                      : "Esta es la descripción de un producto..."}
                  </p>
                </div>
              </div>
              
              {/* Parte inferior: Precio y botón en un div separado */}
              <div className="recommendation-footer">
                <span className="recommendation-price">$ {product.price.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <button 
                  className="add-recommendation-button"
                  onClick={(e) => handleAddRecommendedProduct(product.id, e)}
                >
                  Agregar
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
