export interface PaymentRequest {
  orderId?: string;
  paymentMethod: "mpesa" | "credit_card" | "paypal";
  phoneNo?: string;
  amount: number;
  deliveryDetails?: {
    region: string;
    town: string;
  };
  billingAddress?: {
    firstname: string;
    lastname: string;
    email: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  status: "pending" | "completed" | "failed";
}
