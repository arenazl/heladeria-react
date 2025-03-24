import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryBar from '../components/CategoryBar';
import SubcategoryBar from '../components/SubcategoryBar';
import ProductListing from '../components/ProductListing';
import AllProductsListing from '../components/AllProductsList';
import { dataService } from '../services/data.service';
import '../styles/ProductBrowsing.css';

const ProductBrowsing: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if data is loaded
  useEffect(() => {
    if (!dataService.isLoaded()) {
      // If data is not loaded, redirect to welcome screen
      navigate('/');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const scrollToTop = () => {
    // Use window.scrollTo for more reliable scrolling
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to top when category or subcategory changes
  useEffect(() => {
    scrollToTop();
  }, [selectedCategoryId, selectedSubcategoryId]);

  const handleCategorySelect = (categoryId: number) => {
    // If already selected, deselect it
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
    setSelectedSubcategoryId(null); // Reset subcategory selection when category changes
    
    // Explicitly call scrollToTop for immediate effect
    scrollToTop();
  };

  const handleSubcategorySelect = (subcategoryId: number | null) => {
    setSelectedSubcategoryId(subcategoryId);
    
    // Explicitly call scrollToTop for immediate effect
    scrollToTop();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="product-browsing-container">
      <div className="fixed-navigation">
        <CategoryBar 
          selectedCategoryId={selectedCategoryId} 
          onCategorySelect={handleCategorySelect} 
        />
        <SubcategoryBar 
          categoryId={selectedCategoryId} 
          selectedSubcategoryId={selectedSubcategoryId} 
          onSubcategorySelect={handleSubcategorySelect} 
        />
      </div>
      
      <div 
        className={`product-content ${selectedCategoryId ? 'with-category' : ''} ${selectedCategoryId && selectedSubcategoryId ? 'with-subcategory' : ''}`} 
        ref={contentRef}
      >
        {selectedCategoryId ? (
          <ProductListing 
            categoryId={selectedCategoryId} 
            selectedSubcategoryId={selectedSubcategoryId} 
          />
        ) : (
          <AllProductsListing />
        )}
      </div>
    </div>
  );
};


export default ProductBrowsing;
