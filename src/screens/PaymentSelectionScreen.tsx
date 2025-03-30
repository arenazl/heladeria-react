import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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

type PaymentSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'PaymentSelection'>;

type PaymentMethod = 'cash' | 'card' | 'transfer';

const PaymentSelectionScreen: React.FC = () => {
  const navigation = useNavigation<PaymentSelectionNavigationProp>();
  const { order, clearOrder } = useOrder();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmPayment = () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Error", "Por favor selecciona un método de pago");
      return;
    }

    Alert.alert(
      "Pago Exitoso",
      `Tu pedido ha sido procesado correctamente con ${getPaymentMethodName(selectedPaymentMethod)}.`,
      [
        {
          text: "OK",
          onPress: () => {
            clearOrder();
            navigation.navigate('Welcome');
          }
        }
      ]
    );
  };

  const getPaymentMethodName = (method: PaymentMethod): string => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccionar Método de Pago</Text>

      <View style={styles.orderSummary}>
        <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
        <Text style={styles.summaryText}>Cantidad de productos: {order.items.reduce((total, item) => total + item.quantity, 0)}</Text>
        <Text style={styles.totalPrice}>Total: ${order.total.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Tiempo estimado de entrega: 30 min.</Text>
      </View>

      <View style={styles.paymentMethods}>
        <Text style={styles.sectionTitle}>Métodos de Pago</Text>

        <TouchableOpacity
          style={[
            styles.paymentMethodItem,
            selectedPaymentMethod === 'cash' && styles.selectedPaymentMethod
          ]}
          onPress={() => handleSelectPaymentMethod('cash')}
        >
          <Text style={styles.paymentMethodName}>Efectivo</Text>
          <Text style={styles.paymentMethodDescription}>Pago en efectivo al momento de la entrega</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentMethodItem,
            selectedPaymentMethod === 'card' && styles.selectedPaymentMethod
          ]}
          onPress={() => handleSelectPaymentMethod('card')}
        >
          <Text style={styles.paymentMethodName}>Tarjeta de Crédito/Débito</Text>
          <Text style={styles.paymentMethodDescription}>Pago con tarjeta al momento de la entrega</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentMethodItem,
            selectedPaymentMethod === 'transfer' && styles.selectedPaymentMethod
          ]}
          onPress={() => handleSelectPaymentMethod('transfer')}
        >
          <Text style={styles.paymentMethodName}>Transferencia Bancaria</Text>
          <Text style={styles.paymentMethodDescription}>Transferencia a nuestra cuenta bancaria</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedPaymentMethod && styles.disabledButton
          ]}
          onPress={handleConfirmPayment}
          disabled={!selectedPaymentMethod}
        >
          <Text style={styles.confirmButtonText}>Confirmar Pago</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
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
    marginBottom: 20,
  },
  orderSummary: {
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
  summaryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginTop: 5,
  },
  paymentMethods: {
    flex: 1,
  },
  paymentMethodItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedPaymentMethod: {
    backgroundColor: '#fff8f8',
    borderColor: '#ff6b6b',
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#666',
  },
  buttonsContainer: {
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#ffb8b8',
  },
  confirmButtonText: {
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

export default PaymentSelectionScreen;
