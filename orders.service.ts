import { useQuery } from "@tanstack/react-query";
import apiRequest from "../utils/axiosInstance";
import { Order } from "../store/slices/ordersSlice";

// Fetch orders for a specific user
export const useGetOrders = (userId: string) => {
  return useQuery<Order[]>({
    queryKey: ["orders", userId],
    queryFn: async () => {
      try {
        const { data } = await apiRequest.get<Order[]>(
          `/api/orders/user/${userId}`,
        );
        if (!data || data.length === 0) {
          throw new Error("No orders found for this user");
        }
        return data.map((order) => ({
          ...order,
          createdAt: order.createdAt || new Date().toISOString(),
          status: order.status || "pending",
          totalAmount: order.totalAmount || 0,
          orderItems: order.orderItems || [],
          delivery: order.delivery || [],
        }));
      } catch (error) {
        throw new Error(`Failed to fetch orders: ${error}`);
      }
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Track order by tracking number
export const trackOrder = async (orderId: string, trackingNumber: string) => {
  const { data } = await apiRequest.get(
    `/api/orders/${orderId}/track/${trackingNumber}`,
  );
  return data;
};
