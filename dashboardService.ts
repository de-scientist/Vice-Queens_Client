import apiRequest from "../utils/axiosInstance";

export const fetchStats = async () => {
  const response = await apiRequest.get(`/api/admin/dashboard`);
  return response.data;
};

export const fetchRecentOrders = async () => {
  const response = await apiRequest.get(`/orders/recent`);
  return response.data;
};

export const fetchLowStockProducts = async () => {
  const response = await apiRequest.get(`/products/low-stock`);
  return response.data;
};
