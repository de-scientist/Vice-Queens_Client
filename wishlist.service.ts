import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../utils/axiosInstance";
import { Product } from "../store/slices/product";

export const useGetWishlist = (userId: string) => {
  return useQuery<Product[]>({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/api/wishlist/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useWishlistMutations = () => {
  const queryClient = useQueryClient();

  const addToWishlist = useMutation({
    mutationFn: async ({
      userId,
      productId,
    }: {
      userId: string;
      productId: string;
    }) => {
      const { data } = await apiRequest.post(`/api/wishlist/${userId}/add`, {
        productId,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return { addToWishlist };
};
