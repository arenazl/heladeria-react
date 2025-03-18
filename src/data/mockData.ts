import { Category, Subcategory, Product, Customer } from '../models/types';

export const categories: Category[] = [
  {
    id: 1,
    name: 'Helados',
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    name: 'Postres',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    name: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    name: 'Cafetería',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 5,
    name: 'Snacks',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

export const subcategories: Subcategory[] = [
  // Helados subcategories
  {
    id: 1,
    categoryId: 1,
    name: 'Helados de Crema',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    categoryId: 1,
    name: 'Helados de Agua',
    image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    categoryId: 1,
    name: 'Helados Especiales',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 4,
    categoryId: 1,
    name: 'Helados Sin Azúcar',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Postres subcategories
  {
    id: 5,
    categoryId: 2,
    name: 'Tortas Heladas',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 6,
    categoryId: 2,
    name: 'Copas Heladas',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Bebidas subcategories
  {
    id: 7,
    categoryId: 3,
    name: 'Licuados',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 8,
    categoryId: 3,
    name: 'Gaseosas',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Cafetería subcategories
  {
    id: 9,
    categoryId: 4,
    name: 'Cafés Especiales',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 10,
    categoryId: 4,
    name: 'Tés y Infusiones',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Snacks subcategories
  {
    id: 11,
    categoryId: 5,
    name: 'Bocadillos Salados',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

export const products: Product[] = [
  // Helados de Crema
  {
    id: 1,
    subcategoryId: 1,
    name: 'Chocolate',
    description: 'Helado cremoso de chocolate con trozos de chocolate amargo',
    price: 500,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    subcategoryId: 1,
    name: 'Vainilla',
    description: 'Helado cremoso de vainilla con semillas de vainilla natural',
    price: 450,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    subcategoryId: 1,
    name: 'Dulce de Leche',
    description: 'Helado cremoso de dulce de leche con vetas de dulce de leche casero',
    price: 550,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Helados de Agua
  {
    id: 4,
    subcategoryId: 2,
    name: 'Limón',
    description: 'Helado refrescante de limón con un toque de menta',
    price: 400,
    image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 5,
    subcategoryId: 2,
    name: 'Frutilla',
    description: 'Helado de agua con trozos de frutilla natural',
    price: 420,
    image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Helados Especiales
  {
    id: 6,
    subcategoryId: 3,
    name: 'Banana Split',
    description: 'Helado especial con banana, chocolate, crema y cerezas',
    price: 800,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 7,
    subcategoryId: 3,
    name: 'Sundae de Chocolate',
    description: 'Helado de vainilla con salsa de chocolate caliente y nueces',
    price: 750,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Helados Sin Azúcar
  {
    id: 8,
    subcategoryId: 4,
    name: 'Chocolate Sin Azúcar',
    description: 'Helado de chocolate endulzado con stevia, ideal para diabéticos',
    price: 600,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 9,
    subcategoryId: 4,
    name: 'Vainilla Sin Azúcar',
    description: 'Helado de vainilla endulzado con eritritol, bajo en calorías',
    price: 580,
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Tortas Heladas
  {
    id: 10,
    subcategoryId: 5,
    name: 'Torta Oreo',
    description: 'Torta helada con base de galletas Oreo y helado de crema',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 11,
    subcategoryId: 5,
    name: 'Torta Brownie',
    description: 'Torta helada con base de brownie y helado de chocolate',
    price: 1300,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Copas Heladas
  {
    id: 12,
    subcategoryId: 6,
    name: 'Copa Lola',
    description: 'Copa con helado de chocolate, dulce de leche y crema',
    price: 900,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 13,
    subcategoryId: 6,
    name: 'Copa Frutal',
    description: 'Copa con helado de frutilla, limón y frutas frescas',
    price: 850,
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Licuados
  {
    id: 14,
    subcategoryId: 7,
    name: 'Licuado de Frutilla',
    description: 'Licuado refrescante de frutillas con leche y azúcar',
    price: 600,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 15,
    subcategoryId: 7,
    name: 'Licuado de Banana',
    description: 'Licuado cremoso de banana con leche y miel',
    price: 580,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Gaseosas
  {
    id: 16,
    subcategoryId: 8,
    name: 'Coca-Cola',
    description: 'Gaseosa Coca-Cola 500ml',
    price: 350,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 17,
    subcategoryId: 8,
    name: 'Sprite',
    description: 'Gaseosa Sprite 500ml',
    price: 350,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Cafés Especiales
  {
    id: 18,
    subcategoryId: 9,
    name: 'Cappuccino',
    description: 'Café espresso con leche vaporizada y espuma de leche',
    price: 450,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 19,
    subcategoryId: 9,
    name: 'Latte Macchiato',
    description: 'Café con leche vaporizada y una capa de espuma cremosa',
    price: 480,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Tés y Infusiones
  {
    id: 20,
    subcategoryId: 10,
    name: 'Té Verde',
    description: 'Té verde con notas cítricas y un toque de menta',
    price: 350,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 21,
    subcategoryId: 10,
    name: 'Té de Frutos Rojos',
    description: 'Infusión de frutos rojos con un toque de canela',
    price: 380,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  
  // Bocadillos Salados
  {
    id: 22,
    subcategoryId: 11,
    name: 'Nachos con Queso',
    description: 'Nachos crujientes con salsa de queso cheddar',
    price: 650,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 23,
    subcategoryId: 11,
    name: 'Papas Fritas',
    description: 'Papas fritas crocantes con sal marina',
    price: 550,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }
];

export const customers: Customer[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    address: 'Av. Rivadavia 1234, CABA',
    phone: '1155667788'
  },
  {
    id: 2,
    name: 'María González',
    address: 'Av. Corrientes 5678, CABA',
    phone: '1199887766'
  },
  {
    id: 3,
    name: 'Carlos Rodríguez',
    address: 'Av. Santa Fe 9012, CABA',
    phone: '1144332211'
  },
  {
    id: 4,
    name: 'Laura Fernández',
    address: 'Av. Cabildo 3456, CABA',
    phone: '1122334455'
  },
  {
    id: 5,
    name: 'Roberto Martínez',
    address: 'Av. Córdoba 7890, CABA',
    phone: '1177889900'
  }
];

// Helper functions to get data
export const getCategoryById = (id: number): Category | undefined => {
  return categories.find(category => category.id === id);
};

export const getSubcategoriesByCategoryId = (categoryId: number): Subcategory[] => {
  return subcategories.filter(subcategory => subcategory.categoryId === categoryId);
};

export const getSubcategoryById = (id: number): Subcategory | undefined => {
  return subcategories.find(subcategory => subcategory.id === id);
};

export const getProductsBySubcategoryId = (subcategoryId: number): Product[] => {
  return products.filter(product => product.subcategoryId === subcategoryId);
};

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getCustomerById = (id: number): Customer | undefined => {
  return customers.find(customer => customer.id === id);
};

// Function to get related products based on a product id
export const getRelatedProducts = (productId: number, limit: number = 3): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  
  // Get products from the same subcategory (excluding the current product)
  let relatedProducts = products.filter(p => 
    p.subcategoryId === product.subcategoryId && p.id !== productId
  );
  
  // If we don't have enough products, get products from other subcategories in the same category
  if (relatedProducts.length < limit) {
    const subcategory = getSubcategoryById(product.subcategoryId);
    if (subcategory) {
      const categoryProducts = products.filter(p => {
        const pSubcategory = getSubcategoryById(p.subcategoryId);
        return pSubcategory && 
               pSubcategory.categoryId === subcategory.categoryId && 
               p.id !== productId && 
               !relatedProducts.some(rp => rp.id === p.id);
      });
      
      relatedProducts = [...relatedProducts, ...categoryProducts];
    }
  }
  
  // Return only the requested number of products
  return relatedProducts.slice(0, limit);
};