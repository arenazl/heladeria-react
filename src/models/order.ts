// Base class
export class ContextualPropsVM {
    CurrentTimeZone: number = -3;
    // Note: Each derived class defines its own DateCreated, DateUpdated, CreatedUserId, UpdatedUserId, and IsActive properties
    
    constructor(data?: Partial<ContextualPropsVM>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

// OrderDispatchVM
export class DeliveryCompanyVM extends ContextualPropsVM {
    Id: number = 0;
    Name: string = '';
    Description: string = '';
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<DeliveryCompanyVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class NameIdVM {
    Id: number = 0;
    Name: string = '';
    Tag: string = '';
    NameIds: NameIdVM[] = [];
    PicturePath: string = '';
    
    constructor(data?: Partial<NameIdVM>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class OrderDispatchVM extends ContextualPropsVM {
    Id: number = 0;
    DeliveryDate: Date = new Date();
    DelayInMinutes?: number;
    OrderDispatchAddressId?: number;
    Addresses: NameIdVM[] = [];
    OrderDispatchPhoneId?: number;
    DeliveryCompanyId?: number;
    DeliveryCompany: DeliveryCompanyVM | null = null;
    OrderDispatchStateId?: number;
    EmployeeId?: number;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<OrderDispatchVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

// OrderRestaurantVM
export class EmployeeRoleVM {
    // Properties for employee role
    
    constructor(data?: Partial<EmployeeRoleVM>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class EmployeeTableVM {
    // Properties for employee table
    
    constructor(data?: Partial<EmployeeTableVM>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class EmployeePaymentVM {
    // Properties for employee payment
    
    constructor(data?: Partial<EmployeePaymentVM>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class EmployeeVM extends ContextualPropsVM {
    Id: number = 0;
    Name: string = '';
    Code: string = '';
    Birthdate?: Date;
    Email: string = '';
    Wage?: number;
    EmployeeRoleId: number = 0;
    EmployeeRole: EmployeeRoleVM = new EmployeeRoleVM();
    Tables: EmployeeTableVM[] = [];
    EmployeePayments: EmployeePaymentVM[] = [];
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<EmployeeVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class ProductVM {
    // Properties for product
    
    constructor(data?: Partial<ProductVM>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class OrderRestaurantCommensalVM extends ContextualPropsVM {
    Id: number = 0;
    ProductId: number = 0;
    Product: ProductVM = new ProductVM();
    Quantity: number = 0;
    UnitPrice: number = 0;
    TotalPrice: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<OrderRestaurantCommensalVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class OrderRestaurantVM extends ContextualPropsVM {
    Id: number = 0;
    TableId: number = 0;
    TableName: string = '';
    TableAreaId: number = 0;
    TableAreaName: string = '';
    EmployeeId?: number;
    EmployeeName: string = '';
    Employee: EmployeeVM = new EmployeeVM();
    PeopleCount: number = 0;
    TableStatusId: number = 0;
    OrderRestaurantCommensalId: number = 0;
    OrderRestaurantCommensal: OrderRestaurantCommensalVM = new OrderRestaurantCommensalVM();
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<OrderRestaurantVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

// OrderProductItemVM
export class AlicuotaVM extends ContextualPropsVM {
    Id: number = 0;
    Name: string = '';
    Description: string = '';
    Percentage: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<AlicuotaVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class ObservationVM {
    // Properties for observation
    
    constructor(data?: Partial<ObservationVM>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class OrderProductItemObservationVM extends ContextualPropsVM {
    Id: number = 0;
    OrderProductItemId: number = 0;
    ObservationId: number = 0;
    Observation: ObservationVM = new ObservationVM();
    Level: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<OrderProductItemObservationVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class OrderProductOptionItemObservationVM {
    // Properties for order product option item observation
    
    constructor(data?: Partial<OrderProductOptionItemObservationVM>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class OrderProductOptionItemVM extends ContextualPropsVM {
    Id: number = 0;
    ProductOptionId: number = 0;
    OrderProductItemId: number = 0;
    ProductOptionGroupId: number = 0;
    ProductId: number = 0;
    SizeId?: number;
    Price: number = 0;
    Quantity: number = 0;
    ProductName: string = '';
    PriceWithNoTax: number = 0;
    AlicuotaPercentage: number = 0;
    AlicuotaId: number = 0;
    Observation: string = '';
    Observations: OrderProductOptionItemObservationVM[] = [];
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<OrderProductOptionItemVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class OrderProductItemVM extends ContextualPropsVM {
    Id: number = 0;
    OrderId: number = 0;
    ProductId: number = 0;
    ProductName: string = '';
    ProductUnitPriceWithNoTax: number = 0;
    UnitCost: number = 0;
    UnitPrice: number = 0;
    Quantity: number = 0;
    SubTotal: number = 0;
    Tax: number = 0;
    Total: number = 0;
    AlicuotaPercentage: number = 0;
    AlicuotaId: number = 0;
    Alicuota: AlicuotaVM = new AlicuotaVM();
    IsSpecialPrice: boolean = false;
    IsPeopleTableCommensalProduct: boolean = false;
    Observation: string = '';
    Observations: OrderProductItemObservationVM[] = [];
    Options: OrderProductOptionItemVM[] = [];
    Discount: number = 0;
    DiscountPercentage: number = 0;
    Subtotal2: number = 0;
    IsStarter: boolean = false;
    IsInvitation: boolean = false;
    InvitationObservation: string = '';
    ProductTypeId?: number;
    ProductTypeName: string = '';
    SaleMethodId?: number;
    SizeId?: number;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    SubCategoryId?: number;
    AlaxUnits: number = 0;
    
    constructor(data?: Partial<OrderProductItemVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

// OrderCommensalItemVM
export class OrderCommensalItemVM extends ContextualPropsVM {
    Id: number = 0;
    OrderId: number = 0;
    CommensalId: number = 0;
    CommensalName: string = '';
    CommensalUnitPriceWithNoTax: number = 0;
    UnitCost: number = 0;
    UnitPrice: number = 0;
    Quantity: number = 0;
    SubTotal: number = 0;
    Tax: number = 0;
    Total: number = 0;
    AlicuotaPercentage: number = 0;
    AlicuotaId: number = 0;
    Alicuota: AlicuotaVM = new AlicuotaVM();
    IsSpecialPrice: boolean = false;
    IsPeopleTableCommensalCommensal: boolean = false;
    Observation: string = '';
    Discount: number = 0;
    DiscountPercentage: number = 0;
    Subtotal2: number = 0;
    IsStarter: boolean = false;
    IsInvitation: boolean = false;
    InvitationObservation: string = '';
    CommensalTypeId?: number;
    CommensalTypeName: string = '';
    SaleMethodId?: number;
    SizeId?: number;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<OrderCommensalItemVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

// CustomerPaymentVM
export class CustomerPaymentCardVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    CardCompanyId: number = 0;
    CardCompanyName: string = '';
    IsCreditCard: boolean = false;
    IsDebitCard: boolean = false;
    Amount: number = 0;
    Ticket: string = '';
    CardNumber: string = '';
    Quotes?: number;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentCardVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentCashVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    CashDrawerId: number = 0;
    Amount: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentCashVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentValeVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    Amount: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentValeVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentTransferVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    Amount: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentTransferVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentMercadoPagoVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    Amount: number = 0;
    IsQrPayment: boolean = false;
    IsLinkPayment: boolean = false;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentMercadoPagoVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentPedidosYaVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    Amount: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentPedidosYaVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentMasDeliveryVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    Amount: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentMasDeliveryVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentRappiVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    Amount: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentRappiVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentUberEatsVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    Amount: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentUberEatsVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentJustoVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    Amount: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentJustoVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentTipVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerPaymentId: number = 0;
    PaymentOptionId: number = 0;
    Tip: number = 0;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<CustomerPaymentTipVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class CustomerPaymentVM extends ContextualPropsVM {
    Id: number = 0;
    OrderId: number = 0;
    CustomerId?: number;
    PaymentOptionId: number = 0;
    Amount: number = 0;
    Observation: string = '';
    ShiftId?: number;
    PayWith: number = 0;
    CashDrawerId: number = 0;
    CustomerPaymentCards: CustomerPaymentCardVM[] = [];
    CustomerPaymentCashes: CustomerPaymentCashVM[] = [];
    CustomerPaymentVales: CustomerPaymentValeVM[] = [];
    CustomerPaymentTransfers: CustomerPaymentTransferVM[] = [];
    CustomerPaymentMercadoPagos: CustomerPaymentMercadoPagoVM[] = [];
    CustomerPaymentPedidosYas: CustomerPaymentPedidosYaVM[] = [];
    CustomerPaymentMasDeliveries: CustomerPaymentMasDeliveryVM[] = [];
    CustomerPaymentRappis: CustomerPaymentRappiVM[] = [];
    CustomerPaymentUberEats: CustomerPaymentUberEatsVM[] = [];
    CustomerPaymentJusto: CustomerPaymentJustoVM[] = [];
    CustomerPaymentTips: CustomerPaymentTipVM[] = [];
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    IsEditPayment: boolean = false;
    
    constructor(data?: Partial<CustomerPaymentVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

// OrderCouponVM
export class OrderCouponVM extends ContextualPropsVM {
    Id: number = 0;
    OrderId: number = 0;
    AlaxCouponCode: string = '';
    AlaxCouponName: string = '';
    Discount: number = 0;
    DiscountUnits: number = 0;
    
    constructor(data?: Partial<OrderCouponVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

// PartnerOrderVM
export class PartnerOrderJsonFileVM extends ContextualPropsVM {
    Id: number = 0;
    MappedOrderJson: string = '';
    UnmappedOrderJson: string = '';
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<PartnerOrderJsonFileVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class PartnerOrderItemVM extends ContextualPropsVM {
    Id: number = 0;
    PartnerOrderId: number = 0;
    ProductId: number = 0;
    ProductName: string = '';
    UnitPrice: number = 0;
    Quantity: number = 0;
    Subtotal: number = 0;
    Tax: number = 0;
    Total: number = 0;
    Observation: string = '';
    IsInnerProductItem: boolean = false;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    
    constructor(data?: Partial<PartnerOrderItemVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class PartnerResponseOptionVM extends ContextualPropsVM {
    Id: number = 0;
    Description: string = '';
    ValueFrom: number = 0;
    ValueTo: number = 0;
    PartnerResponseOptionType: number = 0;
    PartnerId: number = 0;
    
    constructor(data?: Partial<PartnerResponseOptionVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class RappiQRVM extends ContextualPropsVM {
    OrderId: string = '';
    StoreId: string = '';
    ProductConfirmationCode: string = '';
    QRCode: string = '';
    
    constructor(data?: Partial<RappiQRVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

export class PartnerOrderVM extends ContextualPropsVM {
    Id: number = 0;
    PartnerOrderNumber: string = '';
    PartnerId: number = 0;
    PartnerName: string = '';
    PartnerOrderStatusId: number = 0;
    PartnerOrderJsonFileId: number = 0;
    PartnerOrderJsonFile: PartnerOrderJsonFileVM = new PartnerOrderJsonFileVM();
    IsDeliveryDateScheduled: boolean = false;
    RestaurantIntegrationCode: string = '';
    Date: Date = new Date();
    DeliveryAddress: string = '';
    DeliveryDate: Date = new Date();
    CustomerId: number = 0;
    CustomerName: string = '';
    CustomerPhone: string = '';
    Discount: number = 0;
    Subtotal: number = 0;
    Tax: number = 0;
    Total: number = 0;
    Observation: string = '';
    ErrorMesagge: string = '';
    ResponseDataTextRepresentation: string = '';
    Items: PartnerOrderItemVM[] = [];
    PartnerLogoPath: string = '';
    OrderId: number = 0;
    Order: OrderVM | null = null;
    PartnerResponseOptionSelected: PartnerResponseOptionVM | null = null;
    AskSaveOrderWithError: boolean = false;
    SaveOrderWithError: boolean = false;
    ForceOrderRemoval: boolean = false;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    IsFromAutomatization: boolean = false;
    Token: string = '';
    RappiQR: RappiQRVM | null = null;
    WorkstationId: number = 0;
    
    constructor(data?: Partial<PartnerOrderVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}

// Main OrderVM class
export class OrderVM extends ContextualPropsVM {
    Id: number = 0;
    CustomerId?: number;
    CustomerName: string = '';
    CustomerDocNumber: string = '';
    CustomerDocTypeId?: number;
    StartDate: Date = new Date();
    EndDate?: Date;
    DurationInSeconds?: number;
    Subtotal: number = 0;
    Tax: number = 0;
    Total: number = 0;
    ProductItemsCount: number = 0;
    ProductItemUnitsCount: number = 0;
    PointOfSaleId: number = 0;
    ShiftId?: number;
    OrderDispatchId?: number;
    Lat?: number;
    Lng?: number;
    OrderDispatch: OrderDispatchVM | null = null;
    OrderRestaurantId?: number;
    SaleChannelId?: number;
    SaleChannelName: string = '';
    OrderTypeId: number = 0;
    OrderRestaurant: OrderRestaurantVM | null = null;
    Items: OrderProductItemVM[] = [];
    Commensals: OrderCommensalItemVM[] = [];
    CustomerPayments: CustomerPaymentVM[] = [];
    DiscountOptionId?: number;
    Discount: number = 0;
    ShippingCost?: number;
    DiscountPercentage: number = 0;
    Subtotal2: number = 0;
    TotalWithNoDiscount: number = 0;
    PriceListId?: number;
    PriceListName: string = '';
    IsInvoiced: boolean = false;
    IsMustInvoiceOrder: boolean = false;
    Observation: string = '';
    PartnerOrder: PartnerOrderVM = new PartnerOrderVM();
    UseThirdPartyDeliveryLogistics: boolean = false;
    DateCreated: Date = new Date();
    DateUpdated?: Date;
    CreatedUserId: number = 0;
    UpdatedUserId?: number;
    IsActive: boolean = true;
    SubCategory?: number;
    IsTransfer: boolean = false;
    TransferDescription: string = '';
    TransferObservation: string = '';
    KitchenOrderId: number = 0;
    UniqueKey: string = '';
    Coupons: OrderCouponVM[] = [];
    AlaxCouponDiscount: number = 0;
    AlaxCouponDiscountUnits: number = 0;
    AlaxDNI: number = 0;
    SendAlaxUnits: boolean = false;
    WorkStationId: number = 0;
    HasCustomerPayments: boolean = false;
    
    constructor(data?: Partial<OrderVM>) {
        super(data);
        if (data) {
            Object.assign(this, data);
        }
    }
}
