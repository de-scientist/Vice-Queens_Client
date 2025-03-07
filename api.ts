import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Base API URL

// ✅ Sign Up a New Customer (POST)
export const signUpCustomer = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/api/register`, userData); // Updated route
  return response.data;
};


// ✅ Log In a Customer (POST)
export const loginCustomer = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, userData);
  return response.data;
};

// ✅ Log Out a Customer (POST)
export const logoutCustomer = async () => {
  const response = await axios.post(
    `${API_URL}/api/auth/logout`,
    {},
    {
      withCredentials: true, // Ensures cookies (e.g., JWT tokens) are sent with the request
    }
  );
  return response.data;
};


// ✅ Get User Profile (GET)
export const getUserProfile = async (userId: string) => {
  const response = await axios.get(`${API_URL}/api/user/${userId}`);
  return response.data;
};

// ✅ Update User Profile (PUT)
export const updateUserProfile = async (userId: string, updateData: object) => {
  const response = await axios.put(`${API_URL}/api/user/${userId}`, updateData);
  return response.data;
};

// ✅ Delete User Account (DELETE)
export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${API_URL}/api/user/${userId}`);
  return response.data;
};

// ✅ Add Product to Cart (POST)
export const addToCart = async (productId: string, quantity: number) => {
  const response = await axios.post(`${API_URL}/api/cart`, {
    productId,
    quantity,
  });
  return response.data;
};

export const addQuantity = () => {
  console.log("Adding quantity...");
};


// ✅ Remove Item from Cart (DELETE)
export const removeFromCart = async (productId: string) => {
  const response = await axios.delete(`${API_URL}/api/cart/${productId}`);
  return response.data;
};

export const deleteQuantity = async (productId: string, quantity: number) => {
  try {
    const response = await fetch(`/api/cart/${productId}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete quantity");
    }

    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};


// ✅ Get All Cart Items (GET)
export const getCartItems = async () => {
  const response = await axios.get(`${API_URL}/api/cart`);
  return response.data;
};

// ✅ Checkout Order (POST)
export const checkout = async (orderData: {
  totalAmount: number;
  status: string;
  orderItems: Array<{ productId: string; quantity: number }>;
}) => {
  const response = await axios.post(`${API_URL}/api/order`, orderData);
  return response.data;
};

// ✅ Update Order Status (PUT)
export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await axios.put(`${API_URL}/api/order/${orderId}`, { status });
  return response.data;
};

