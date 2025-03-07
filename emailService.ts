import apiRequest from "../utils/axiosInstance";

interface EmailData {
  to: string;
  subject: string;
  transactionDetails: {
    orderId: string;
    items: any[];
    total: number;
    billingAddress: {
      firstname: string;
      lastname: string;
      email: string;
    };
    deliveryDetails: {
      region: string;
      town: string;
    };
  };
}

export const sendTransactionEmail = async (emailData: EmailData) => {
  try {
    const response = await apiRequest.post("/api/email/transaction", emailData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to send transaction email");
  }
};
