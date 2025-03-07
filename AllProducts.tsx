import React, { useState, useEffect } from "react";
import Categories from "../components/Categories";
import { Divider } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import ProductCard from "../components/ProductCard";
import { useNavigate, useLocation } from "react-router-dom";
import { setSelectedProduct } from "../store/slices/selectedProduct";
import {
  getAllProducts,
  getProductById,
  getSearch,
  sortProducts,
} from "../services/useproducts";
import { useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import { useQuery } from "@tanstack/react-query";
import ErrorUI from "../components/ErrorUI";
import { useWishlistMutations } from "../services/wishlist.service";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import initiateToastAlert from "../utils/Toster";

const AllProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchKeyword = queryParams.get("q") || ""; // Changed from 'query' to 'q'
  const [selectSortByCriteria, setSelectSortByCriteria] =
    useState<string>("popularity");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { addToWishlist } = useWishlistMutations();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", searchKeyword],
    queryFn: async () => {
      if (searchKeyword.trim()) {
        const searchResults = await getSearch(searchKeyword.trim());
        if (searchResults.length === 0) {
          throw new Error("No products found matching your search criteria.");
        }
        return searchResults;
      }
      return getAllProducts();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const sortedProducts = React.useMemo(() => {
    if (!products) return [];
    return sortProducts(products, selectSortByCriteria as any);
  }, [products, selectSortByCriteria]);

  useEffect(() => {
    // Update URL when search changes
    const params = new URLSearchParams(location.search);
    if (searchKeyword) {
      params.set("q", searchKeyword);
    } else {
      params.delete("q");
    }
    const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [searchKeyword, location]);

  const handleProductClick = async (id: string) => {
    console.log("Product ID received:", id); // Debug log

    if (!id || typeof id !== "string") {
      setError(`Invalid product ID type: ${typeof id}`);
      return;
    }

    try {
      console.log("Fetching product with ID:", id); // Debug log
      const productData = await getProductById(id);

      if (!productData || !productData.id) {
        throw new Error("Invalid product data received");
      }

      dispatch(setSelectedProduct(productData.id));
      navigate(`/product/${productData.id}`);
    } catch (err) {
      console.error("Product fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch product");
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await addToWishlist.mutateAsync({
        userId: user.id,
        productId,
      });
      initiateToastAlert("Added to wishlist", "success");
    } catch (error) {
      initiateToastAlert(
        error instanceof Error ? error.message : "Failed to add to wishlist",
        "error",
      );
    }
  };

  const sortBy = [
    { key: "factory", label: "Leasing" },
    { key: "product", label: "Category" },
    { key: "low", label: "Low to High" },
    { key: "high", label: "High to Low" },
    { key: "rating", label: "Top Sale" },
  ];

  return (
    <div className="min-h-screen w-screen bg-background">
      <Navbar />
      <div className="flex container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-4">
        <Categories />
        <div className="min-h-[70vh] flex-1 bg-white rounded-lg p-4">
          <div className="flex items-center">
            <h1 className="capitalize text-text">{`${products?.length || 0} products found`}</h1>
            <div className="ml-auto">
              <Select
                color="primary"
                className="w-[10rem] ml-auto"
                size="sm"
                label="Sort By:"
                defaultSelectedKeys={["popularity"]}
                variant="bordered"
                selectedKeys={new Set([selectSortByCriteria])}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys as Set<string>)[0];
                  setSelectSortByCriteria(value);
                }}
              >
                {sortBy.map((sorting) => (
                  <SelectItem key={sorting.key}>{sorting.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <Divider className="bg-background my-2" />
          {isLoading && (
            <div className="flex justify-center items-center min-h-[200px]">
              <Spinner size="lg" color="primary" />
            </div>
          )}
          {isError && (
            <ErrorUI
              message="No matching products found"
              suggestion={`We couldn't find any products matching "${searchKeyword}". Try using different keywords or browse our categories.`}
            />
          )}
          {!isLoading && !isError && sortedProducts.length > 0 ? (
            <div className="flex flex-col items-center sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id.toString()} // Ensure ID is string
                  name={product.name}
                  currentPrice={product.currentPrice}
                  previousPrice={product.previousPrice}
                  imageUrl={product.images?.[0]}
                  rating={product.reviews?.starRating || 0} // Add fallback value
                  onViewClick={() => handleProductClick(product.id.toString())} // Ensure ID is passed correctly
                  onAddToWishlist={() => handleAddToWishlist(product.id)}
                  isAuthenticated={!!user}
                  product={product} // Pass full product object
                />
              ))}
            </div>
          ) : (
            !isLoading &&
            !error && <p className="text-center">No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
