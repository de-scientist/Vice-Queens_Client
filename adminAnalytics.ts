import apiRequest from "../utils/axiosInstance";

const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    throw new Error("Unauthorized access. Please login again.");
  }
  throw error;
};

export const getAnalytics = {
  sales: async () => {
    try {
      const response = await apiRequest.get("/api/admin/analytics/sales");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  revenue: async () => {
    try {
      const response = await apiRequest.get("/api/admin/analytics/revenue");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  bestSelling: async () => {
    try {
      const response = await apiRequest.get(
        "/api/admin/analytics/best-selling",
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  monthlySales: async () => {
    try {
      const response = await apiRequest.get(
        "/api/admin/analytics/monthly-sales",
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  orders: async () => {
    try {
      const response = await apiRequest.get("/api/admin/analytics/orders");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  recentOrders: async () => {
    try {
      const response = await apiRequest.get(
        "/api/admin/analytics/recent-orders",
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  pendingDeliveries: async () => {
    try {
      const response = await apiRequest.get(
        "/api/admin/analytics/pending-deliveries",
      );
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  lowStock: async () => {
    try {
      const response = await apiRequest.get("/api/admin/analytics/low-stock");
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};
