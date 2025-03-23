import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useOrder } from '../context/OrderContext';
import { OrderItem } from '../models/types';

type RootStackParamList = {
  Welcome: undefined;
  ProductBrowsing: undefined;
  ProductDetail: { productId: number };
  QuantitySelection: { productId: number };
  CustomerSelection: undefined;
  OrderConfirmation: undefined;
  PaymentSelection: undefined;
};

type OrderConfirmationNavigationProp = StackNavigationProp<RootStackParamList, 'OrderConfirmation'>;

const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<OrderConfirmationNavigationProp>();
  const { order, removeFromOrder, updateQuantity } = useOrder();
  
  const handleRemoveItem = (productId: number) => {
    Alert.alert(
      "Eliminar Producto",
      "¿Estás seguro que deseas eliminar este producto del pedido?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          onPress: () => removeFromOrder(productId),
          style: "destructive"
        }
      ]
    );
  };

  const handleUpdateQuantity = (productId: number, quantity: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + quantity;
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleProceedToPayment = () => {
    navigation.navigate('PaymentSelection');
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
    <View style={styles.orderItem}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.product.name}</Text>
        <Text style={styles.itemPrice}>${item.product.price} x {item.quantity}</Text>
        <Text style={styles.itemTotal}>${(item.product.price * item.quantity).toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.productId, -1, item.quantity)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.productId, 1, item.quantity)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.productId)}
        >
          <Text style={styles.removeButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Pedido</Text>
      
      {order.customer && (
        <View style={styles.customerInfo}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <Text style={styles.customerName}>{order.customer.name}</Text>
          <Text style={styles.customerDetails}>{order.customer.address}</Text>
          <Text style={styles.customerDetails}>{order.customer.phone}</Text>
        </View>
      )}
      
      <View style={styles.orderItems}>
        <Text style={styles.sectionTitle}>Productos</Text>
        
        {order.items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay productos en el pedido</Text>
            <TouchableOpacity 
              style={styles.addProductsButton}
              onPress={() => navigation.navigate('ProductBrowsing')}
            >
              <Text style={styles.addProductsButtonText}>Agregar Productos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={order.items}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.productId.toString()}
            contentContainerStyle={styles.itemsList}
          />
        )}
      </View>
      
      {order.items.length > 0 && (
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>${order.total.toFixed(2)}</Text>
        </View>
      )}
      
      <View style={styles.buttonsContainer}>
        {order.items.length > 0 && (
          <TouchableOpacity 
            style={styles.paymentButton}
            onPress={handleProceedToPayment}
          >
            <Text style={styles.paymentButtonText}>Proceder al Pago</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('ProductBrowsing')}
        >
          <Text style={styles.backButtonText}>Volver a Productos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 0,
    paddingbottom: 0
  },
  customerInfo: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  customerDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  orderItems: {
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 15,
  },
  addProductsButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addProductsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemsList: {
    flexGrow: 1,
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemDetails: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginTop: 5,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ff6b6b',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  removeButtonText: {
    color: '#ff6b6b',
    fontSize: 14,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
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
  buttonsContainer: {
    marginTop: 10,
  },
  paymentButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentButtonText: {
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

export default OrderConfirmationScreen;
