import React from "react";
import { LuHeart, LuShoppingCart, LuTrash2 } from "react-icons/lu";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  useGetWishlist,
  useWishlistMutations,
} from "../../services/wishlist.service";
import { Button, Card } from "@heroui/react";
import LazyImage from "../../components/LazyImage";
import Spinner from "../../components/Spinner";
import initiateToastAlert from "../../utils/Toster";
import { useNavigate } from "react-router-dom";

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: wishlistItems, isLoading } = useGetWishlist(user?.id || "");
  const { removeFromWishlist } = useWishlistMutations();

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist.mutateAsync({
        userId: user?.id || "",
        productId,
      });
      initiateToastAlert("Item removed from wishlist", "success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      initiateToastAlert("Failed to remove item", error);
    }
  };

  if (isLoading) {
    return <Spinner size="lg" color="primary" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <LuHeart className="text-xl text-primary" />
          <h2 className="text-2xl font-semibold">My Wishlist</h2>
        </div>
        <p className="text-gray-600">{wishlistItems?.length || 0} items</p>
      </div>

      {wishlistItems?.length === 0 ? (
        <div className="text-center py-12">
          <LuHeart className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Browse our products and add your favorites!
          </p>
          <Button
            color="primary"
            variant="flat"
            onPress={() => navigate("/all-products")}
          >
            Explore Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems?.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <div className="relative group">
                <LazyImage
                  classNames="w-full h-48 object-cover rounded-t-lg"
                  src={item.images[0]}
                  alt={item.name}
                  width="full"
                  height="48"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {item.name}
                </h3>
                <p className="text-primary font-semibold mb-4">
                  ${item.currentPrice.toFixed(2)}
                </p>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    color="primary"
                    variant="flat"
                    startContent={<LuShoppingCart />}
                    onPress={() => navigate(`/product/${item.id}`)}
                  >
                    View Product
                  </Button>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onPress={() => handleRemoveFromWishlist(item.id)}
                  >
                    <LuTrash2 />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
