export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderDTO {
  userId: string;
  totalAmount: number;
  transactionId:   orderIorderItems: OrderItem[];
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  transactionId: string;
  orderItems: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled';
ncelled';
  createdAt: string;
  updatedAt: string;
}
