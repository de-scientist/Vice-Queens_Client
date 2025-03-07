import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiRequest from '../utils/axiosInstance';
import { CreateOrderDTO, OrderItem } from '../types/order';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, totalAmount, orderItems }: {
      userId: string;
      totalAmount: number;
      orderItems: OrderItem[];
    }) => {
      const payload: CreateOrderDTO = {
        userId,
        totalAmount,
        transactionId: `tx_${Date.now()}`,
        orderItems: orderItems
      };

      const { data } = await apiRequest.post('/api/orders', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};
