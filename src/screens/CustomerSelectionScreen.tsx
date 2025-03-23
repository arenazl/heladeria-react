import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { customers } from '../data/mockData';
import { useOrder } from '../context/OrderContext';
import { Customer } from '../models/types';

type RootStackParamList = {
  Welcome: undefined;
  ProductBrowsing: undefined;
  ProductDetail: { productId: number };
  QuantitySelection: { productId: number };
  CustomerSelection: undefined;
  OrderConfirmation: undefined;
  PaymentSelection: undefined;
};

type CustomerSelectionNavigationProp = StackNavigationProp<RootStackParamList, 'CustomerSelection'>;

const CustomerSelectionScreen: React.FC = () => {
  const navigation = useNavigation<CustomerSelectionNavigationProp>();
  const { setCustomer } = useOrder();
  const [searchText, setSearchText] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  
  const filteredCustomers = searchText.trim() === '' 
    ? customers 
    : customers.filter(customer => 
        customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.phone.includes(searchText)
      );

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id);
  };

  const handleConfirmCustomer = () => {
    if (selectedCustomerId) {
      const customer = customers.find(c => c.id === selectedCustomerId);
      if (customer) {
        setCustomer(customer);
        navigation.navigate('OrderConfirmation');
      }
    }
  };

  const renderCustomerItem = ({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={[
        styles.customerItem,
        selectedCustomerId === item.id && styles.selectedCustomerItem
      ]}
      onPress={() => handleSelectCustomer(item)}
    >
      <Text style={styles.customerName}>{item.name}</Text>
      <Text style={styles.customerDetails}>{item.address}</Text>
      <Text style={styles.customerDetails}>{item.phone}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleccionar Cliente</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o teléfono"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.customersList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron clientes</Text>
          </View>
        }
      />
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            !selectedCustomerId && styles.disabledButton
          ]}
          onPress={handleConfirmCustomer}
          disabled={!selectedCustomerId}
        >
          <Text style={styles.confirmButtonText}>Confirmar Cliente</Text>
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
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  customersList: {
    flexGrow: 1,
  },
  customerItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCustomerItem: {
    backgroundColor: '#fff8f8',
    borderColor: '#ff6b6b',
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  customerDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
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

export default CustomerSelectionScreen;
