import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, OrderItem, Product, Customer } from '../models/types';
import { generateEstimatedPickupTime } from '../utils/orderUtils';

interface OrderContextType {
  order: Order;
  addToOrder: (product: Product, quantity: number) => void;
  removeFromOrder: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  setCustomer: (customer: Customer) => void;
  setCustomerName: (name: string) => void;
  setEstimatedPickupTime: () => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [order, setOrder] = useState<Order>({
    items: [],
    total: 0,
  });

  const calculateTotal = (items: OrderItem[]): number => {
    return items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const addToOrder = (product: Product, quantity: number) => {
    setOrder((prevOrder) => {
      // Check if the product is already in the order
      const existingItemIndex = prevOrder.items.findIndex(
        (item) => item.productId === product.id
      );

      let updatedItems: OrderItem[];

      if (existingItemIndex >= 0) {
        // Update quantity if product already exists in order
        updatedItems = [...prevOrder.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item to order
        updatedItems = [
          ...prevOrder.items,
          {
            productId: product.id,
            quantity,
            product,
          },
        ];
      }

      return {
        ...prevOrder,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    });
  };

  const removeFromOrder = (productId: number) => {
    setOrder((prevOrder) => {
      const updatedItems = prevOrder.items.filter(
        (item) => item.productId !== productId
      );

      return {
        ...prevOrder,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setOrder((prevOrder) => {
      const updatedItems = prevOrder.items.map((item) => {
        if (item.productId === productId) {
          return {
            ...item,
            quantity,
          };
        }
        return item;
      });

      return {
        ...prevOrder,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    });
  };

  const setCustomer = (customer: Customer) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      customerId: customer.id,
      customer,
    }));
  };

  const setCustomerName = (name: string) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      customerName: name,
    }));
  };

  const setEstimatedPickupTime = () => {
    const estimatedTime = generateEstimatedPickupTime();
    setOrder((prevOrder) => ({
      ...prevOrder,
      estimatedPickupTime: estimatedTime,
    }));
  };

  const clearOrder = () => {
    setOrder(prevOrder => ({
      items: [],
      total: 0,
      customerId: prevOrder.customerId,
      customer: prevOrder.customer
    }));
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        addToOrder,
        removeFromOrder,
        updateQuantity,
        setCustomer,
        setCustomerName,
        setEstimatedPickupTime,
        clearOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
