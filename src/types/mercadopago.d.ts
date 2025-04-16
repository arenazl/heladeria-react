interface MercadoPagoInstance {
  checkout: (options: {
    preference: {
      id: string;
    };
    render: {
      container: string;
      label: string;
    };
    callbacks: {
      onSuccess: () => void;
      onError: (error: any) => void;
    };
  }) => void;
}

interface Window {
  MercadoPago: {
    new (publicKey: string, options?: { locale: string }): MercadoPagoInstance;
  };
}
