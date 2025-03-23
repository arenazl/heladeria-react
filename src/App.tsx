import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { OrderProvider } from './context/OrderContext';
import { useOrder } from './context/OrderContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomeScreen from './pages/WelcomeScreen';
import ProductBrowsing from './pages/ProductBrowsing';
import ProductDetail from './pages/ProductDetail';
import QuantitySelection from './pages/QuantitySelection';
import CustomerSelection from './pages/CustomerSelection';
import OrderConfirmation from './pages/OrderConfirmation';
import PaymentSelection from './pages/PaymentSelection';
import './App.css';

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
          <Route path="/products" element={<ProductBrowsing />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          <Route path="/quantity" element={<QuantitySelection />} />
          <Route 
            path="/customers" 
            element={
              <CustomerGuard>
                <CustomerSelection />
              </CustomerGuard>
            } 
          />
          <Route path="/confirmation" element={<OrderConfirmation />} />
          <Route path="/payment" element={<PaymentSelection />} />
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
