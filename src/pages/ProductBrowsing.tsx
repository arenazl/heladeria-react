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
    const checkDataAndLoad = async () => {
      if (!dataService.isLoaded()) {
        // Try to load data from sessionStorage
        const companyId = sessionStorage.getItem('companyId');
        const priceListId = sessionStorage.getItem('priceListId');
        
        if (companyId && priceListId) {
          console.log('Attempting to load data from sessionStorage:', { companyId, priceListId });
          try {
            // Try to load data
            const success = await dataService.loadData(companyId, priceListId);
            
            if (success) {
              console.log('Successfully loaded data from sessionStorage');
              setLoading(false);
              return;
            } else {
              console.error('Failed to load data from sessionStorage');
            }
          } catch (error) {
            console.error('Error loading data from sessionStorage:', error);
          }
        }
        
        // If we get here, either no companyId/priceListId in sessionStorage or loading failed
        console.log('Redirecting to home page due to missing or failed data load');
        navigate('/');
      } else {
        console.log('Data already loaded, proceeding to product browsing');
        setLoading(false);
      }
    };
    
    checkDataAndLoad();
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
