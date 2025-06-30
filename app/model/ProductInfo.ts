 export interface ProductInfo {
    product_name: string;
    product_name_en: string;
    image_url: string;
    product_quantity: number;
    nutriments: {
      [key: string]: number;
    };
  }
  