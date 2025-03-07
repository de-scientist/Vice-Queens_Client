import apiRequest from "../utils/axiosInstance";
import { PaymentRequest, PaymentResponse } from "../types/payment";

export const initiatePayment = async (
  paymentData: PaymentRequest,
): Promise<PaymentResponse> => {
  try {
    const response = await apiRequest.post("/api/payments", paymentData);
    return response.data;
  } catch (error: any) {
    console.error("Payment initiation error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Payment failed");
  }
};

export const validatePhoneNumber = (phone: string): string => {
  let formattedPhone = phone.replace(/\D/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "254" + formattedPhone.slice(1);
  }
  if (!formattedPhone.startsWith("254")) {
    formattedPhone = "254" + formattedPhone;
  }
  return formattedPhone;
};
