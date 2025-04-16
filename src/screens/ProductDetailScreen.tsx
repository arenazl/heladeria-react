import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getProductById, getRelatedProducts } from '../data/mockData';
import { Product } from '../models/types';

type RootStackParamList = {
  Welcome: undefined;
  ProductBrowsing: undefined;
  ProductDetail: { productId: number };
  QuantitySelection: { productId: number };
  CustomerSelection: undefined;
  OrderConfirmation: undefined;
  PaymentSelection: undefined;
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;
type ProductDetailNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const { productId } = route.params;
  
  const product = getProductById(productId);
  const relatedProducts = getRelatedProducts(productId, 3);
  
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

  const handleAddToCart = () => {
    navigation.navigate('QuantitySelection', { productId: product.id });
  };

  const renderRelatedProduct = (relatedProduct: Product) => (
    <TouchableOpacity
      key={relatedProduct.id}
      style={styles.relatedProductItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: relatedProduct.id })}
    >
      <Text style={styles.relatedProductName}>{relatedProduct.name}</Text>
      <Text style={styles.relatedProductPrice}>${relatedProduct.price}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.productDetails}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddToCart}
      >
        <Text style={styles.addButtonText}>Agregar al Pedido</Text>
      </TouchableOpacity>
      
      {relatedProducts.length > 0 && (
        <View style={styles.relatedProductsSection}>
          <Text style={styles.sectionTitle}>Productos Relacionados</Text>
          <View style={styles.relatedProductsList}>
            {relatedProducts.map(renderRelatedProduct)}
          </View>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Volver a Productos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 60, /* Space for the fixed header */
    marginBottom: 70, /* Space for the fixed footer */
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
  productHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  productDetails: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#ff6b6b',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  relatedProductsSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  relatedProductsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relatedProductItem: {
    width: '30%',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  relatedProductName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  relatedProductPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProductDetailScreen;
