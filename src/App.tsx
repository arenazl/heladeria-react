import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { OrderProvider } from './context/OrderContext';
import { useOrder } from './context/OrderContext';
import { ThemeProvider } from './context/ThemeContext';
import { RelatedProductsProvider } from './context/RelatedProductsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import TestFooter from './components/TestFooter';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopOnMount from './components/ScrollToTopOnMount';
import RefreshHandler from './components/RefreshHandler';
import TitleUpdater from './components/TitleUpdater';
import { dataService } from './services/data.service';
import { initializeBlobStorage } from './config/image.config';
import { sessionService } from './services/session.service';
import WelcomeScreen from './pages/WelcomeScreen';
import ProductBrowsing from './pages/ProductBrowsing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import PaymentSelection from './pages/PaymentSelection';
import PaymentSuccess from './pages/PaymentSuccess';
import OrderStatus from './pages/OrderStatus';
import OrderReady from './pages/OrderReady';
import MenuLoader from './pages/MenuLoader';
import QRCodePage from './pages/QRCodePage';
import TestApi from './pages/TestApi';
import Settings from './pages/Settings';
import './App.css';
import './styles/DarkThemeOverrides.css';
import './styles/OrangeThemeOverrides.css';
import './styles/BrickThemeOverrides.css';
import { API_CONFIG } from './config/api.config';

// Route guard component to check for existing customer
const CustomerGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { order } = useOrder();
  
  // If a customer is already selected, redirect to confirmation
  if (order.customer) {
    return <Navigate to="/confirmation" replace />;
  }
  
  return <>{children}</>;
};

// Simple fade animation
const pageVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  },
  out: {
    opacity: 0
  }
};

// Fast fade transition
const pageTransition = {
  type: 'tween',
  ease: 'linear',
  duration: 0.1
};

// Animated routes component with simple fade animation
const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Actualizar el título de la página cuando cambia la ruta
  useEffect(() => {
    // Intentar obtener el nombre de la compañía de localStorage
    const companyName = localStorage.getItem('companyName');
    if (companyName) {
      document.title = companyName;
    }
  }, [location.pathname]);
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={location.pathname}
        className="app-content"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <RefreshHandler />
        <Routes location={location}>
          <Route path="/" element={<QRCodePage />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/menu/:companyId/:priceListId" element={<MenuLoader />} />
          <Route path="/products" element={<ProductBrowsing />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/confirmation" element={<OrderConfirmation />} />
          <Route path="/payment" element={<PaymentSelection />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/order-status" element={<OrderStatus />} />
          <Route path="/order-ready" element={<OrderReady />} />
          <Route path="/qr" element={<QRCodePage />} />
          <Route path="/test-api" element={<TestApi />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
};

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  // Check if data is loaded and initialize blob storage
  useEffect(() => {
    const checkDataLoaded = () => {
      const loaded = dataService.isLoaded();
      setIsDataLoaded(loaded);
    };

    // Check initially
    checkDataLoaded();

    // Set up an interval to check periodically
    const interval = setInterval(checkDataLoaded, 1000);

    // Initialize blob storage
    initializeBlobStorage().catch((error: unknown) => {
      console.error('Failed to initialize blob storage:', error);
    });

    return () => clearInterval(interval);
  }, []);

  return (
      <ThemeProvider>
        <RelatedProductsProvider>
          <OrderProvider>
            <Router>
              <div className="app">
                <TitleUpdater />
                <ScrollToTopOnMount />
                {/* Only show header on specific pages */}
                {isDataLoaded && (
                  window.location.hash.includes('/products') || 
                  window.location.hash.includes('/cart') || 
                  window.location.hash.includes('/confirmation') || 
                  window.location.hash.includes('/payment') || 
                  window.location.hash.includes('/order')
                ) && <Header />}
                <AnimatedRoutes />
                {/* Footer is controlled by its own internal logic */}
                <Footer />
                <ScrollToTop />
              </div>
            </Router>
          </OrderProvider>
        </RelatedProductsProvider>
      </ThemeProvider>
  );
}

export default App;
