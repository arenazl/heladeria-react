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

export const products = [
  // Helados de Crema
  {
    id: 1,
    subcategoryId: 1,
    name: 'Chocolate',
    description: 'Helado cremoso de chocolate con trozos de chocolate amargo',
    price: 500,
    image: 'https://images.unsplash.com/photo-1570197788417-0e823a6400a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 2,
    subcategoryId: 1,
    name: 'Vainilla',
    description: 'Helado cremoso de vainilla con semillas de vainilla natural',
    price: 450,
    image: 'https://images.unsplash.com/photo-1499638673688-66a3a885e851?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 3,
    subcategoryId: 1,
    name: 'Dulce de Leche',
    description: 'Helado cremoso de dulce de leche con vetas de dulce de leche casero',
    price: 550,
    image: 'https://images.unsplash.com/photo-1624372812999-2b2b4f2e6e7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 24,
    subcategoryId: 1,
    name: 'Cookies & Cream',
    description: 'Helado de crema con trozos de galletas de chocolate',
    price: 520,
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 25,
    subcategoryId: 1,
    name: 'Banana Split',
    description: 'Helado de crema de banana con trozos de chocolate',
    price: 530,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc64575?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 26,
    subcategoryId: 1,
    name: 'Menta Granizada',
    description: 'Helado refrescante de menta con trozos de chocolate',
    price: 540,
    image: 'https://images.unsplash.com/photo-1623357954511-9d6281e73c8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Helados de Agua
  {
    id: 4,
    subcategoryId: 2,
    name: 'Limón',
    description: 'Helado refrescante de limón con un toque de menta',
    price: 400,
    image: 'https://images.unsplash.com/photo-1623681003933-9374986e6e84?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 5,
    subcategoryId: 2,
    name: 'Frutilla',
    description: 'Helado de agua con trozos de frutilla natural',
    price: 420,
    image: 'https://images.unsplash.com/photo-1567206563064-6f505af6ca07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 27,
    subcategoryId: 2,
    name: 'Maracuyá',
    description: 'Helado de agua con pulpa natural de maracuyá',
    price: 430,
    image: 'https://images.unsplash.com/photo-1601599841041-7e5e06660457?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 28,
    subcategoryId: 2,
    name: 'Sandía',
    description: 'Helado refrescante de sandía, ideal para el verano',
    price: 410,
    image: 'https://images.unsplash.com/photo-1621869028458-3b6b66e7ebfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 29,
    subcategoryId: 2,
    name: 'Mango',
    description: 'Helado tropical de mango con un toque de jengibre',
    price: 440,
    image: 'https://images.unsplash.com/photo-1601001435826-5732cc5f3f2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Helados Especiales
  {
    id: 6,
    subcategoryId: 3,
    name: 'Banana Split',
    description: 'Helado especial con banana, chocolate, crema y cerezas',
    price: 800,
    image: 'https://images.unsplash.com/photo-1567206563064-6f505af6ca07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 7,
    subcategoryId: 3,
    name: 'Sundae de Chocolate',
    description: 'Helado de vainilla con salsa de chocolate caliente y nueces',
    price: 750,
    image: 'https://images.unsplash.com/photo-1594484459480-661952fbd6dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 30,
    subcategoryId: 3,
    name: 'Affogato',
    description: 'Helado de vainilla con un shot de café espresso caliente',
    price: 680,
    image: 'https://images.unsplash.com/photo-1559051679-309b91d8f717?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 31,
    subcategoryId: 3,
    name: 'Brownie Explosion',
    description: 'Helado de chocolate con trozos de brownie y salsa de caramelo',
    price: 820,
    image: 'https://images.unsplash.com/photo-1602351447937-745cb720f435?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Helados Sin Azúcar
  {
    id: 8,
    subcategoryId: 4,
    name: 'Chocolate Sin Azúcar',
    description: 'Helado de chocolate endulzado con stevia, ideal para diabéticos',
    price: 600,
    image: 'https://images.unsplash.com/photo-1570197788417-0e823a6400a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 9,
    subcategoryId: 4,
    name: 'Vainilla Sin Azúcar',
    description: 'Helado de vainilla endulzado con eritritol, bajo en calorías',
    price: 580,
    image: 'https://images.unsplash.com/photo-1499638673688-66a3a885e851?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 32,
    subcategoryId: 4,
    name: 'Frutilla Sin Azúcar',
    description: 'Helado de frutilla endulzado naturalmente con xilitol',
    price: 590,
    image: 'https://images.unsplash.com/photo-1567206563064-6f505af6ca07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 33,
    subcategoryId: 4,
    name: 'Limón Sin Azúcar',
    description: 'Sorbete de limón refrescante sin azúcar añadida',
    price: 570,
    image: 'https://images.unsplash.com/photo-1623681003933-9374986e6e84?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Tortas Heladas
  {
    id: 10,
    subcategoryId: 5,
    name: 'Torta Oreo',
    description: 'Torta helada con base de galletas Oreo y helado de crema',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1602351447937-745cb720f435?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 11,
    subcategoryId: 5,
    name: 'Torta Brownie',
    description: 'Torta helada con base de brownie y helado de chocolate',
    price: 1300,
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 34,
    subcategoryId: 5,
    name: 'Torta Tres Leches',
    description: 'Torta helada de vainilla con base de bizcochuelo tres leches',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1602351447937-745cb720f435?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 35,
    subcategoryId: 5,
    name: 'Cheesecake Helado',
    description: 'Cheesecake helado con salsa de frutos rojos',
    price: 1350,
    image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Copas Heladas
  {
    id: 12,
    subcategoryId: 6,
    name: 'Copa Lola',
    description: 'Copa con helado de chocolate, dulce de leche y crema',
    price: 900,
    image: 'https://images.unsplash.com/photo-1594484459480-661952fbd6dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 13,
    subcategoryId: 6,
    name: 'Copa Frutal',
    description: 'Copa con helado de frutilla, limón y frutas frescas',
    price: 850,
    image: 'https://images.unsplash.com/photo-1567206563064-6f505af6ca07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 36,
    subcategoryId: 6,
    name: 'Copa Chocolate Lover',
    description: 'Copa con tres tipos de helado de chocolate y salsa de chocolate',
    price: 920,
    image: 'https://images.unsplash.com/photo-1570197788417-0e823a6400a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 37,
    subcategoryId: 6,
    name: 'Copa Tropical',
    description: 'Copa con helados de mango, maracuyá y coco con frutas tropicales',
    price: 880,
    image: 'https://images.unsplash.com/photo-1601001435826-5732cc5f3f2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Licuados
  {
    id: 14,
    subcategoryId: 7,
    name: 'Licuado de Frutilla',
    description: 'Licuado refrescante de frutillas con leche y azúcar',
    price: 600,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd3d5129?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 15,
    subcategoryId: 7,
    name: 'Licuado de Banana',
    description: 'Licuado cremoso de banana con leche y miel',
    price: 580,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 38,
    subcategoryId: 7,
    name: 'Licuado Verde',
    description: 'Licuado saludable de espinaca, manzana verde y jengibre',
    price: 620,
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 39,
    subcategoryId: 7,
    name: 'Licuado de Frutos Rojos',
    description: 'Licuado energético de frutillas, frambuesas y arándanos',
    price: 650,
    image: 'https://images.unsplash.com/photo-1596399909739-3e37364f8596?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 40,
    subcategoryId: 7,
    name: 'Licuado Tropical',
    description: 'Licuado refrescante de mango, ananá y coco',
    price: 630,
    image: 'https://images.unsplash.com/photo-1601001435826-5732cc5f3f2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Gaseosas
  {
    id: 16,
    subcategoryId: 8,
    name: 'Coca-Cola',
    description: 'Gaseosa Coca-Cola 500ml',
    price: 350,
    image: 'https://images.unsplash.com/photo-1622771314716-69ebfa92b399?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 17,
    subcategoryId: 8,
    name: 'Sprite',
    description: 'Gaseosa Sprite 500ml',
    price: 350,
    image: 'https://images.unsplash.com/photo-1622771314716-69ebfa92b399?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 41,
    subcategoryId: 8,
    name: 'Fanta',
    description: 'Gaseosa Fanta naranja 500ml',
    price: 350,
    image: 'https://images.unsplash.com/photo-1622771314716-69ebfa92b399?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 42,
    subcategoryId: 8,
    name: 'Agua con Gas',
    description: 'Agua mineral con gas 500ml',
    price: 300,
    image: 'https://images.unsplash.com/photo-1561043433-aaf687c4d2aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 43,
    subcategoryId: 8,
    name: 'Agua Mineral',
    description: 'Agua mineral sin gas 500ml',
    price: 280,
    image: 'https://images.unsplash.com/photo-1561043433-aaf687c4d2aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Cafés Especiales
  {
    id: 18,
    subcategoryId: 9,
    name: 'Cappuccino',
    description: 'Café espresso con leche vaporizada y espuma de leche',
    price: 450,
    image: 'https://images.unsplash.com/photo-1572449043416-2409e5b4d5fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 19,
    subcategoryId: 9,
    name: 'Latte Macchiato',
    description: 'Café con leche vaporizada y una capa de espuma cremosa',
    price: 480,
    image: 'https://images.unsplash.com/photo-1593443320909-3cb2c14c8743?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 44,
    subcategoryId: 9,
    name: 'Flat White',
    description: 'Café espresso con microespuma de leche',
    price: 470,
    image: 'https://images.unsplash.com/photo-1557772611-722dabe20396?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 45,
    subcategoryId: 9,
    name: 'Espresso',
    description: 'Shot de café espresso puro y concentrado',
    price: 400,
    image: 'https://images.unsplash.com/photo-1579992353414-5085ea183121?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 46,
    subcategoryId: 9,
    name: 'Café Mocha',
    description: 'Café espresso con chocolate y leche vaporizada',
    price: 490,
    image: 'https://images.unsplash.com/photo-1541167760492-022a539a4b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Tés y Infusiones
  {
    id: 20,
    subcategoryId: 10,
    name: 'Té Verde',
    description: 'Té verde con notas cítricas y un toque de menta',
    price: 350,
    image: 'https://images.unsplash.com/photo-1627435367898-667aaf4b49a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 21,
    subcategoryId: 10,
    name: 'Té de Frutos Rojos',
    description: 'Infusión de frutos rojos con un toque de canela',
    price: 380,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 47,
    subcategoryId: 10,
    name: 'Té Earl Grey',
    description: 'Té negro aromatizado con bergamota',
    price: 370,
    image: 'https://images.unsplash.com/photo-1606161023097-4b54fe715b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 48,
    subcategoryId: 10,
    name: 'Té Chai',
    description: 'Té negro con especias aromáticas y leche',
    price: 390,
    image: 'https://images.unsplash.com/photo-1576092768110-0d592a58e93f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 49,
    subcategoryId: 10,
    name: 'Infusión de Jengibre y Limón',
    description: 'Infusión revitalizante de jengibre fresco y limón',
    price: 360,
    image: 'https://images.unsplash.com/photo-1606161023097-4b54fe715b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Bocadillos Salados
  {
    id: 22,
    subcategoryId: 11,
    name: 'Nachos con Queso',
    description: 'Nachos crujientes con salsa de queso cheddar',
    price: 650,
    image: 'https://images.unsplash.com/photo-1598550874176-6b0d7d8f1b9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 23,
    subcategoryId: 11,
    name: 'Papas Fritas',
    description: 'Papas fritas crocantes con sal marina',
    price: 550,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 50,
    subcategoryId: 11,
    name: 'Empanadas (2 unidades)',
    description: 'Empanadas criollas de carne o jamón y queso',
    price: 680,
    image: 'https://images.unsplash.com/photo-1608501096651-743d7667f102?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 51,
    subcategoryId: 11,
    name: 'Tequeños (6 unidades)',
    description: 'Palitos de queso envueltos en masa crujiente',
    price: 600,
    image: 'https://images.unsplash.com/photo-1608501096651-743d7667f102?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 52,
    subcategoryId: 11,
    name: 'Mini Pizzas (4 unidades)',
    description: 'Mini pizzas con queso mozzarella, tomate y albahaca',
    price: 700,
    image: 'https://images.unsplash.com/photo-1604063155031-8d3e8e2e3e66?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },

  // Bocadillos Dulces (Subcategory 12 doesn't exist in your subcategories array; assuming it’s intended)
  {
    id: 53,
    subcategoryId: 12,
    name: 'Alfajores (2 unidades)',
    description: 'Alfajores caseros con dulce de leche y coco rallado',
    price: 480,
    image: 'https://images.unsplash.com/photo-1608501096651-743d7667f102?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 54,
    subcategoryId: 12,
    name: 'Brownie',
    description: 'Brownie de chocolate con nueces y trocitos de chocolate',
    price: 450,
    image: 'https://images.unsplash.com/photo-1602351447937-745cb720f435?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 55,
    subcategoryId: 12,
    name: 'Cookies (3 unidades)',
    description: 'Cookies con chips de chocolate recién horneadas',
    price: 400,
    image: 'https://images.unsplash.com/photo-1621335217299-7d5b8b44e125?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 56,
    subcategoryId: 12,
    name: 'Medialunas (2 unidades)',
    description: 'Medialunas dulces de manteca, recién horneadas',
    price: 350,
    image: 'https://images.unsplash.com/photo-1608501096651-743d7667f102?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  {
    id: 57,
    subcategoryId: 12,
    name: 'Budín de Limón',
    description: 'Porción de budín de limón con glaseado',
    price: 420,
    image: 'https://images.unsplash.com/photo-1602351447937-745cb720f435?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
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