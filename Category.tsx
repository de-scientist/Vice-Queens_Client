import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchProducts } from "../store/slices/product";
import { fetchCategories } from "../store/slices/category";
import { CiSearch } from "react-icons/ci";
import { LuSlidersHorizontal, LuArrowDown } from "react-icons/lu";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

type SortOption = "price-asc" | "price-desc" | "rating-desc" | "name-asc";

const Category: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state: RootState) => state.product);
  const { categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.category,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(500);
  const [sortBy, setSortBy] = useState<SortOption>("rating-desc");

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [dispatch, categoryId]);

  const currentCategory = useMemo(() => {
    return categories.find((cat) => cat.id === categoryId);
  }, [categories, categoryId]);

  const categoryProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    const filtered = products.filter(
      (product) =>
        product.category === categoryId &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        product.currentPrice <= priceRange,
    );

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.currentPrice - b.currentPrice;
        case "price-desc":
          return b.currentPrice - a.currentPrice;
        case "rating-desc":
          return b.reviews.length - a.reviews.length;
        case "name-asc":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [products, categoryId, searchQuery, priceRange, sortBy]);

  if (productsLoading || categoriesLoading) {
    return (
      <main className="flex-grow">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </main>
    );
  }

  if (productsError) {
    return (
      <main className="flex-grow">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error: {productsError}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow">
      <Breadcrumbs size="sm">
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Category</BreadcrumbItem>
        <BreadcrumbItem>{currentCategory?.name || "Loading..."}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {currentCategory?.name}
        </h1>
        <p className="mt-2 text-gray-600">
          {currentCategory?.description ||
            `Explore our collection of ${currentCategory?.name?.toLowerCase()} products`}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search in ${currentCategory?.name}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <CiSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="flex gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="rating-desc">Top Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>

          <div className="flex items-center gap-2">
            <LuSlidersHorizontal className="text-gray-400 w-5 h-5" />
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-gray-600">${priceRange}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <LuArrowDown className="w-4 h-4" />
        <span>Sorted by: </span>
        <span className="font-medium">
          {sortBy === "price-asc" && "Price: Low to High"}
          {sortBy === "price-desc" && "Price: High to Low"}
          {sortBy === "rating-desc" && "Top Rated"}
          {sortBy === "name-asc" && "Name: A to Z"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryProducts.length > 0 ? (
          categoryProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.currentPrice}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-600">
                      {product.reviews.length}
                    </span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found in this category matching your criteria
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Category;
