import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getProductById } from '../data/mockData';
import { useOrder } from '../context/OrderContext';

type RootStackParamList = {
  Welcome: undefined;
  ProductBrowsing: undefined;
  ProductDetail: { productId: number };
  QuantitySelection: { productId: number };
  CustomerSelection: undefined;
  OrderConfirmation: undefined;
  PaymentSelection: undefined;
};

type QuantitySelectionRouteProp = RouteProp<RootStackParamList, 'QuantitySelection'>;
type QuantitySelectionNavigationProp = StackNavigationProp<RootStackParamList, 'QuantitySelection'>;

const QuantitySelectionScreen: React.FC = () => {
  const route = useRoute<QuantitySelectionRouteProp>();
  const navigation = useNavigation<QuantitySelectionNavigationProp>();
  const { productId } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { addToOrder } = useOrder();
  
  const product = getProductById(productId);
  
  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    addToOrder(product, quantity);
    navigation.navigate('CustomerSelection');
  };

  return (
    <View style={styles.container}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
      </View>
      
      <View style={styles.quantitySelector}>
        <Text style={styles.sectionTitle}>Seleccionar Cantidad</Text>
        
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            style={[styles.quantityButton, quantity <= 1 && styles.disabledButton]}
            onPress={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={increaseQuantity}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.totalSection}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalPrice}>${(product.price * quantity).toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddToCart}
      >
        <Text style={styles.addButtonText}>Agregar al Pedido</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    marginBottom: 20,
  },
  productInfo: {
    marginBottom: 30,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    color: '#ff6b6b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quantitySelector: {
    marginBottom: 30,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: '#ff6b6b',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ffb8b8',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  addButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default QuantitySelectionScreen;
