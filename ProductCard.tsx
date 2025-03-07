import React from "react";
import { Button } from "@heroui/react";
import LazyImage from "./LazyImage";
import TruncatedText from "./TruncatedText";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../store/slices/cart";
import initiateToastAlert from "../utils/Toster";
import { LuHeart } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { setSelectedProduct } from "../store/slices/selectedProduct";

interface ProductCardProps {
  id: string;
  name: string;
  currentPrice: number;
  previousPrice?: number;
  imageUrl?: string;
  rating: number;
  onAddToWishlist: () => void;
  isAuthenticated: boolean;
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  currentPrice,
  previousPrice,
  imageUrl,
  rating,
  onAddToWishlist,
  isAuthenticated,
  product,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProductClick = () => {
    dispatch(setSelectedProduct(product));
    navigate(`/product/${id}`);
  };

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        id,
        name,
        currentPrice,
        previousPrice,
        quantity: 1,
        imageUrl: imageUrl || "",
      }),
    );
    initiateToastAlert(`${name} added to cart successfully!`, "success");
  };

  const discountPercentage =
    previousPrice && currentPrice
      ? Math.round(((previousPrice - currentPrice) / previousPrice) * 100)
      : null;

  return (
    <div
      className="relative hover:shadow-xl hover:scale-105 cursor-pointer transition-all duration-300 w-52 rounded-lg"
      onClick={handleProductClick}
    >
      {discountPercentage && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          {discountPercentage}% OFF
        </div>
      )}

      <div className="w-full aspect-square">
        <LazyImage
          src={imageUrl || "/placeholder-image.jpg"}
          alt={`Thumbnail for ${name}`}
          height="full"
          width="full"
        />
      </div>

      <div className="p-2" onClick={(e) => e.stopPropagation()}>
        <h3>
          <TruncatedText
            text={name}
            maxLength={40}
            classNames="text-sm font-semibold text-gray-900"
          />
        </h3>

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-text">
              Ksh. {currentPrice}
            </span>
            {previousPrice && (
              <span className="text-sm text-gray-500 line-through">
                Ksh. {previousPrice}
              </span>
            )}
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-gray-600">{rating}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1"
            color="primary"
            variant="solid"
            onPress={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button
            className="flex-1"
            color="secondary"
            variant="flat"
            onPress={onAddToWishlist}
            startContent={<LuHeart />}
            isDisabled={!isAuthenticated}
          >
            Wishlist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
