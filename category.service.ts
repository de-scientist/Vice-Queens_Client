import { useQuery } from "@tanstack/react-query";
import { Category } from "../types/category";
import apiRequest from "../utils/axiosInstance";

export const useGetCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/api/categories`);
      return data;
    },
  });
};

export const useGetCategory = (id: string) => {
  return useQuery<Category>({
    queryKey: ["categories", id],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/api/categories/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
