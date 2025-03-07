export interface Review {
  id: string;
  starRating: number;
  comment: string;
  userId: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  currentPrice: number;
  previousPrice?: number;
  images: string[];
  category: string;
  stock: number;
  reviews: {
    starRating: number;
    items: Review[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}
