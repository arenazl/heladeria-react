import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context interface
interface RelatedProductsContextType {
  showRelatedProducts: boolean;
  setShowRelatedProducts: (show: boolean) => void;
}

// Create the context with a default value
const RelatedProductsContext = createContext<RelatedProductsContextType | undefined>(undefined);

// Custom hook to use the context
export const useRelatedProducts = () => {
  const context = useContext(RelatedProductsContext);
  if (!context) {
    throw new Error('useRelatedProducts debe ser usado dentro de un RelatedProductsProvider');
  }
  return context;
};

// Props for the provider
interface RelatedProductsProviderProps {
  children: ReactNode;
}

// Provider component
export const RelatedProductsProvider: React.FC<RelatedProductsProviderProps> = ({ children }) => {
  // Try to get the saved setting from localStorage, or use the default from manifest.json
  const [showRelatedProducts, setShowRelatedProductsState] = useState<boolean>(() => {
    const savedSetting = localStorage.getItem('showRelatedProducts');
    return savedSetting !== null ? savedSetting === 'true' : true;
  });

  // Load default setting from manifest.json if no setting is saved in localStorage
  useEffect(() => {
    if (localStorage.getItem('showRelatedProducts') === null) {
      fetch('/manifest.json')
        .then(response => response.json())
        .then(manifest => {
          if (manifest.show_related_products !== undefined) {
            const showRelatedFromManifest = Boolean(manifest.show_related_products);
            setShowRelatedProductsState(showRelatedFromManifest);
            localStorage.setItem('showRelatedProducts', showRelatedFromManifest.toString());
            console.log('Loaded default related products setting from manifest.json:', showRelatedFromManifest);
          }
        })
        .catch(error => {
          console.error('Error loading related products setting from manifest.json:', error);
        });
    }
  }, []);

  // Function to change the setting
  const setShowRelatedProducts = (show: boolean) => {
    setShowRelatedProductsState(show);
    localStorage.setItem('showRelatedProducts', show.toString());
  };

  return (
    <RelatedProductsContext.Provider value={{ showRelatedProducts, setShowRelatedProducts }}>
      {children}
    </RelatedProductsContext.Provider>
  );
};
