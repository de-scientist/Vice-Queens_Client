import { useQuery } from "@tanstack/react-query";
import apiRequest from "../utils/axiosInstance";
import { queryKeys } from "../utils/queryKeys";

export const useGetAllCategories = () => {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => {
      const response = await apiRequest.get("/api/categories");
      return response.data;
    },
  });
  return { data, isLoading };
};
