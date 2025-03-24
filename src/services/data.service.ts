import { 
  ApiCategory, 
  ApiProduct, 
  MenuResponse 
} from '../models/api.types';
import { 
  Category, 
  Subcategory, 
  Product 
} from '../models/types';
import { sessionService } from './session.service';
import { apiService } from './api.service';
import { API_CONFIG } from '../config/api.config';
import { categories as mockCategories, subcategories as mockSubcategories, products as mockProducts } from '../data/mockData';

class DataService {
  private categories: Category[] = [];
  private subcategories: Subcategory[] = [];
  private products: Product[] = [];
  private isDataLoaded: boolean = false;
  private companyName: string = '';

  // Convert API data to application data format
  private convertApiDataToAppFormat(menuData: MenuResponse): void {
    this.categories = [];
    this.subcategories = [];
    this.products = [];
    
    // Store company name
    this.companyName = menuData.CompanyName || 'Heladería';

    // Create a map to track subcategories
    const subcategoryMap = new Map<string, Subcategory>();

    // Process categories and products
    menuData.Categories.forEach((apiCategory: ApiCategory) => {
      // Add category
      this.categories.push({
        id: apiCategory.Id,
        name: apiCategory.Name,
        image: undefined // API doesn't provide category images
      });

      // Process products and extract subcategories
      apiCategory.Products.forEach((apiProduct: ApiProduct) => {
        // Check if we already have this subcategory
        const subcategoryKey = `${apiProduct.RubroId}-${apiProduct.SubRubroId}`;
        if (!subcategoryMap.has(subcategoryKey)) {
          // Add new subcategory
          const newSubcategory: Subcategory = {
            id: apiProduct.SubRubroId,
            categoryId: apiProduct.RubroId,
            name: apiProduct.SubRubroName,
            image: undefined // API doesn't provide subcategory images
          };
          subcategoryMap.set(subcategoryKey, newSubcategory);
          this.subcategories.push(newSubcategory);
        }

        // Determine product price
        let price = apiProduct.PriceWithIva;
        if (price === 0 && apiProduct.ProductSizes && apiProduct.ProductSizes.length > 0) {
          // If product has sizes, use the first size's price
          price = apiProduct.ProductSizes[0].Price;
        }

        // Add product
        this.products.push({
          id: apiProduct.Id,
          subcategoryId: apiProduct.SubRubroId,
          name: apiProduct.ProductName,
          description: apiProduct.ProductDescription || '',
          price: price,
          image: apiProduct.PicturePath || undefined
        });
      });
    });

    // Save data to session
    this.isDataLoaded = true;
  }

  // Load data from API or session
  async loadData(companyId: string, priceListId: string): Promise<boolean> {
    try {
      // First try to get from session
      const menuData = sessionService.getMenuDataFromLocalStorage();
      if (menuData) {
        this.convertApiDataToAppFormat(menuData);
        return true;
      }

      // If not in session, get from API
      const menuResponse = await apiService.getMenu(companyId, priceListId);
      const menuData2 = menuResponse.data;

      // Save to session
      sessionService.saveMenuDataInLocalStorage(menuData2);
      sessionService.saveSystemConfigurationInLocalStorage(menuData2.SystemConfiguration);

      // Convert to app format
      this.convertApiDataToAppFormat(menuData2);
      return true;
    } catch (error) {
      console.error('Error loading data:', error);
      return false;
    }
  }

  // Get company name
  getCompanyName(): string {
    return this.companyName;
  }

  // Get all categories
  getCategories(): Category[] {
    if (API_CONFIG.USE_MOCK_DATA && !this.isDataLoaded) {
      return mockCategories;
    }
    return this.categories;
  }

  // Get category by ID
  getCategoryById(id: number): Category | undefined {
    if (API_CONFIG.USE_MOCK_DATA && !this.isDataLoaded) {
      return mockCategories.find(category => category.id === id);
    }
    return this.categories.find(category => category.id === id);
  }

  // Get subcategories by category ID
  getSubcategoriesByCategoryId(categoryId: number): Subcategory[] {
    if (API_CONFIG.USE_MOCK_DATA && !this.isDataLoaded) {
      return mockSubcategories.filter(subcategory => subcategory.categoryId === categoryId);
    }
    return this.subcategories.filter(subcategory => subcategory.categoryId === categoryId);
  }

  // Get subcategory by ID
  getSubcategoryById(id: number): Subcategory | undefined {
    if (API_CONFIG.USE_MOCK_DATA && !this.isDataLoaded) {
      return mockSubcategories.find(subcategory => subcategory.id === id);
    }
    return this.subcategories.find(subcategory => subcategory.id === id);
  }

  // Get products by subcategory ID
  getProductsBySubcategoryId(subcategoryId: number): Product[] {
    if (API_CONFIG.USE_MOCK_DATA && !this.isDataLoaded) {
      return mockProducts.filter(product => product.subcategoryId === subcategoryId);
    }
    return this.products.filter(product => product.subcategoryId === subcategoryId);
  }

  // Get product by ID
  getProductById(id: number): Product | undefined {
    if (API_CONFIG.USE_MOCK_DATA && !this.isDataLoaded) {
      return mockProducts.find(product => product.id === id);
    }
    return this.products.find(product => product.id === id);
  }

  // Get related products
  getRelatedProducts(productId: number, limit: number = 3): Product[] {
    const productsToUse = API_CONFIG.USE_MOCK_DATA && !this.isDataLoaded ? mockProducts : this.products;
    const subcategoriesToUse = API_CONFIG.USE_MOCK_DATA && !this.isDataLoaded ? mockSubcategories : this.subcategories;
    
    const product = this.getProductById(productId);
    if (!product) return [];
    
    // Get products from the same subcategory (excluding the current product)
    let relatedProducts = productsToUse.filter(p => 
      p.subcategoryId === product.subcategoryId && p.id !== productId
    );
    
    // If we don't have enough products, get products from other subcategories in the same category
    if (relatedProducts.length < limit) {
      const subcategory = subcategoriesToUse.find(s => s.id === product.subcategoryId);
      if (subcategory) {
        const categoryProducts = productsToUse.filter(p => {
          const pSubcategory = subcategoriesToUse.find(s => s.id === p.subcategoryId);
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
  }

  // Check if data is loaded
  isLoaded(): boolean {
    return API_CONFIG.USE_MOCK_DATA || this.isDataLoaded;
  }
}

// Create a singleton instance
export const dataService = new DataService();
