import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { categories, subcategories, getSubcategoriesByCategoryId, getProductsBySubcategoryId, products } from '../data/mockData';
import { Category, Subcategory, Product } from '../models/types';

type RootStackParamList = {
  Welcome: undefined;
  ProductBrowsing: undefined;
  ProductDetail: { productId: number };
  QuantitySelection: { productId: number };
  CustomerSelection: undefined;
  OrderConfirmation: undefined;
  PaymentSelection: undefined;
};

type ProductBrowsingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductBrowsing'>;

const ProductBrowsingScreen: React.FC = () => {
  const navigation = useNavigation<ProductBrowsingScreenNavigationProp>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (selectedSubcategoryId) {
      setDisplayedProducts(getProductsBySubcategoryId(selectedSubcategoryId));
    } else if (selectedCategoryId) {
      const subcats = getSubcategoriesByCategoryId(selectedCategoryId);
      let allProducts: Product[] = [];
      subcats.forEach(subcat => {
        allProducts = [...allProducts, ...getProductsBySubcategoryId(subcat.id)];
      });
      setDisplayedProducts(allProducts);
    } else {
      setDisplayedProducts(products);
    }
  }, [selectedCategoryId, selectedSubcategoryId]);

  const handleCategorySelect = (categoryId: number) => {
    if (selectedCategoryId === categoryId) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(categoryId);
    }
    setSelectedSubcategoryId(null);
  };

  const handleSubcategorySelect = (subcategoryId: number) => {
    if (selectedSubcategoryId === subcategoryId) {
      setSelectedSubcategoryId(null);
    } else {
      setSelectedSubcategoryId(subcategoryId);
    }
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategoryId === item.id && styles.selectedCategoryItem
      ]}
      onPress={() => handleCategorySelect(item.id)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategoryId === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSubcategoryItem = ({ item }: { item: Subcategory }) => (
    <TouchableOpacity
      style={[
        styles.subcategoryItem,
        selectedSubcategoryId === item.id && styles.selectedSubcategoryItem
      ]}
      onPress={() => handleSubcategorySelect(item.id)}
    >
      <Text style={[
        styles.subcategoryText,
        selectedSubcategoryId === item.id && styles.selectedSubcategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.productContent}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Fixed navigation section */}
      <View style={styles.fixedNavigation}>
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {selectedCategoryId && (
          <View style={styles.subcategoriesContainer}>
            <FlatList
              data={getSubcategoriesByCategoryId(selectedCategoryId)}
              renderItem={renderSubcategoryItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subcategoriesList}
            />
          </View>
        )}
      </View>

      {/* Scrollable content with padding to account for fixed elements */}
      <FlatList
        data={displayedProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productsList}
        style={[
          styles.productsContainer,
          selectedCategoryId ? (
            selectedSubcategoryId ? styles.withSubcategoryPadding : styles.withCategoryPadding
          ) : null
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fixedNavigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productsContainer: {
    marginTop: 60, // Just enough space for header only
    flex: 1,
  },
  withCategoryPadding: {
    marginTop: 100, // Header (60) + category bar (40)
  },
  withSubcategoryPadding: {
    marginTop: 130, // Header (60) + category bar (40) + subcategory bar (30)
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoriesList: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategoryItem: {
    backgroundColor: '#ff6b6b',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  subcategoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subcategoriesList: {
    paddingHorizontal: 10,
  },
  subcategoryItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 15,
    backgroundColor: '#f8f8f8',
  },
  selectedSubcategoryItem: {
    backgroundColor: '#ffb8b8',
  },
  subcategoryText: {
    fontSize: 12,
    color: '#666',
  },
  selectedSubcategoryText: {
    color: '#333',
    fontWeight: '500',
  },
  productsList: {
    padding: 10,
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productContent: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
});

export default ProductBrowsingScreen;
