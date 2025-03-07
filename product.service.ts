import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../utils/axiosInstance";
import { Product } from "../store/slices/product";

export interface CreateProductDTO {
  name: string;
  currentPrice: number;
  previousPrice?: number;
  category: string;
  description: string;
  stock: number;
  images: string[];
}

export const useGetProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await apiRequest.get("/api/products");
      return data;
    },
  });
};

export const useGetProductById = (id: string) => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/products/${id}`);
      return data;
    },
    enabled: !!id,
  });

  return { data, isLoading, error, isError };
};

export const useCreateProduct = (categoryId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: CreateProductDTO) => {
      const { data } = await apiRequest.post<Product>(
        `/api/categories/${categoryId}/product`,
        productData,
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate both products and category-specific products queries
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({
        queryKey: ["categories", categoryId, "products"],
      });
    },
    onError: (error: Error) => {
      throw new Error(`Failed to create product: ${error.message}`);
    },
  });
};

export const useGetCategoryProducts = (categoryId: string) => {
  return useQuery({
    queryKey: ["categories", categoryId, "products"],
    queryFn: async () => {
      const { data } = await apiRequest.get<Product[]>(
        `/api/categories/${categoryId}/product`,
      );
      return data;
    },
    enabled: Boolean(categoryId),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, error, isError } = useMutation({
    mutationFn: async ({
      id,
      updatedProduct,
    }: {
      id: string;
      updatedProduct: any;
    }) => {
      const { data } = await apiRequest.put(
        `/api/products/${id}`,
        updatedProduct,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { mutate, isLoading, error, isError };
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, error, isError } = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest.delete(`/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return { mutate, isLoading, error, isError };
};
