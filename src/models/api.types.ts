// API Types for Menu API

// System Configuration models
export interface SystemConfigurationDigitalMenu {
  Id: number;
  ActiveColor: string;
  BackColor: string;
  MenuColor: string;
  ProductNameColor: string;
  ProductCardColor: string;
  TitleColor: string;
  TotalColor: string;
  DescriptionColor: string;
  Description: string;
  Name: string;
  ImagePath: string;
  LogoPath: string;
  CurrentTimeZone: number;
}

export interface UploadPath {
  Id: number;
  Name: string;
  Tag: string | null;
  NameIds: any[];
  PicturePath: string | null;
}

export interface SystemConfiguration {
  Id: number;
  Address: string | null;
  City: string;
  State: string;
  Country: string;
  SystemConfigurationDigitalMenu: SystemConfigurationDigitalMenu;
  UploadPaths: UploadPath[];
  CurrentTimeZone: number;
  // Other properties omitted for brevity
}

// Product Size model
export interface ApiProductSize {
  Id: number;
  ProductId: number;
  PriceListId: number;
  SizeId: number;
  SizeName: string;
  PriceNoTax: number;
  Price: number;
  CurrentTimeZone: number;
}

// Product Group Item model
export interface ApiProductGroupItem {
  Id: number;
  Name: string;
  Price: number;
  ProductId: number;
  SizeId: number | null;
  CurrentTimeZone: number;
}

// Product Group model
export interface ApiProductGroup {
  Id: number;
  Name: string;
  ProductGroupItems: ApiProductGroupItem[];
  ProductGroupItemsCount: number;
  CanSelectLessQuantityThatTheCount: boolean;
  IsSelectionOptional: boolean;
  ProductOptionGroupId: number;
  MinQuantity: number;
  MaxQuantity: number;
  CurrentTimeZone: number;
}

// API Product model
export interface ApiProduct {
  Id: number;
  ProductCode: string;
  PriceWithIva: number;
  RubroName: string;
  SubRubroName: string;
  RubroId: number;
  SubRubroId: number;
  ProductName: string;
  ProductTypeId: number;
  ProductTypeName: string;
  SaleMethodId: number;
  ObservationType: string | null;
  MaxObservationsCount: number;
  ProductDescription: string;
  PicturePath: string | null;
  AlaxUnits: number;
  ProductGroups: ApiProductGroup[];
  ProductPromoItems: any[];
  ProductQuantities: any[];
  ProductSizes: ApiProductSize[];
  Cost: number;
  AlicuotaId: number;
  AlicuotaPercentage: number;
  PriceNoTax: number;
  CurrentTimeZone: number;
}

// API Category model
export interface ApiCategory {
  Id: number;
  Name: string;
  Products: ApiProduct[];
  CurrentTimeZone: number;
}

// Main response model for Menu API
export interface MenuResponse {
  Categories: ApiCategory[];
  CompanyName: string | null;
  PriceListId: number;
  PriceListName: string;
  WhatsappPhoneNumber: string | null;
  Table: string | null;
  SystemConfiguration: SystemConfiguration;
  CommensalProducts: any[];
  Order: any | null;
  CurrentTimeZone: number;
}

// Enum for upload paths
export enum UploadPathEnum {
  Product = 'products',
  Category = 'categories',
  SubCategory = 'subCategories',
  Logo = 'logo',
  DigitalMenuImage = 'DigitalMenuImage',
  DigitalMenuLogo = 'DigitalMenuLogo'
}
