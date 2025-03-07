import apiRequest from "../utils/axiosInstance";
// import { queryKeys } from "../utils/queryKeys";

interface Product {
  id: string;
  name: string;
  currentPrice: number;
  previousPrice: number;
  category: string;
  factory?: string;
  reviews?: { starRating: number };
}

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await apiRequest.get(`/api/products/${id}`);
    if (!response.data) {
      throw new Error("Product not found");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const addQuantity = async (productId: string, quantity: number) => {
  const response = await apiRequest.post(`/api/cart/add`, {
    productId,
    quantity,
  });
  return response.data;
};

export const deleteQuantity = async (productId: string, quantity: number) => {
  const response = await apiRequest.post(`/api/cart/delete`, {
    productId,
    quantity,
  });
  return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
  const response = await apiRequest.post(`/api/cart`, {
    productId,
    quantity,
  });
  return response.data;
};

export const checkout = async (items: { id: string; quantity: number }[]) => {
  const response = await apiRequest.post(`/api/order`, {
    items,
  });
  return response.data;
};

export const getCartItems = async () => {
  const response = await apiRequest.get(`/api/cart`);
  return response.data;
};

export const getAllProducts = async () => {
  const response = await apiRequest.get(`/api/products`);
  return response.data;
};

export const getSearch = async (query: string) => {
  const products = await getAllProducts();
  const searchTerms = query.toLowerCase().split(" ");

  return products.filter((product) => {
    const searchableFields = [
      product.name.toLowerCase(),
      product.currentPrice.toString(),
      product.previousPrice.toString(),
    ];

    return searchTerms.every((term) =>
      searchableFields.some((field) => field.includes(term)),
    );
  });
};

type SortCriteria = "factory" | "product" | "low" | "high" | "rating";

export const sortProducts = (products: any[], criteria: SortCriteria) => {
  const sortedProducts = [...products];

  switch (criteria) {
    case "factory":
      // Sort by factory/leasing (assuming there's a factory/leasing field)
      return sortedProducts.sort((a, b) => a.factory?.localeCompare(b.factory));

    case "product":
      // Sort by category
      return sortedProducts.sort((a, b) =>
        a.category?.localeCompare(b.category),
      );

    case "low":
      // Sort by price low to high
      return sortedProducts.sort((a, b) => a.currentPrice - b.currentPrice);

    case "high":
      // Sort by price high to low
      return sortedProducts.sort((a, b) => b.currentPrice - a.currentPrice);

    case "rating":
      // Sort by rating (top sale)
      return sortedProducts.sort(
        (a, b) => (b.reviews?.starRating || 0) - (a.reviews?.starRating || 0),
      );

    default:
      return sortedProducts;
  }
};
