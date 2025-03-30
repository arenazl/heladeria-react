import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { OrderProvider } from './context/OrderContext';
import { useOrder } from './context/OrderContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomeScreen from './pages/WelcomeScreen';
import ProductBrowsing from './pages/ProductBrowsing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import PaymentSelection from './pages/PaymentSelection';
import PaymentProcessor from './pages/PaymentProcessor';
import OrderStatus from './pages/OrderStatus';
import OrderReady from './pages/OrderReady';
import MenuLoader from './pages/MenuLoader';
import QRCodePage from './pages/QRCodePage';
import TestApi from './pages/TestApi';
import './App.css';
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
  
  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.main
        key={location.pathname}
        className="app-content"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/menu/:companyId/:priceListId" element={<MenuLoader />} />
          <Route path="/products" element={<ProductBrowsing />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/confirmation" element={<OrderConfirmation />} />
          <Route path="/payment" element={<PaymentSelection />} />
          <Route path="/payment-processor" element={<PaymentProcessor />} />
          <Route path="/order-status" element={<OrderStatus />} />
          <Route path="/order-ready" element={<OrderReady />} />
          <Route path="/qr" element={<QRCodePage />} />
          <Route path="/qr-example" element={<QRCodePage defaultCompanyId={API_CONFIG.COMPANY_ID} defaultPriceListId="1" />} />
          <Route path="/test-api" element={<TestApi />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
};

function App() {
  return (
    <OrderProvider>
      <Router>
        <div className="app">
          <Header />
          <AnimatedRoutes />
          <Footer />
        </div>
      </Router>
    </OrderProvider>
  );
}

export default App;
