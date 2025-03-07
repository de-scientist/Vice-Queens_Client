/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import Footer from "../components/Footer";
import { Breadcrumbs, BreadcrumbItem, Button, Divider } from "@heroui/react";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import SimilarProducts from "../components/SimilarProducts";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  removeItemFromCart,
  clearCart,
  addItemToCart,
  subtractItemQuantity,
} from "../store/slices/cart";
import ConfirmationModal from "../components/ConfirmationModal";
import initiateToastAlert from "../utils/Toster";
import { useCreateOrder } from "../services/order.service";
// import { addOrder } from "../store/slices/order";

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [modalItem, setModalItem] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [clearAll, setClearAll] = useState<boolean>(false);
  const createOrder = useCreateOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const addQuantity = (id: string) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      dispatch(addItemToCart({ ...item, quantity: 1 }));
    }
  };
  const subtractQuantity = (id: string) => {
    dispatch(subtractItemQuantity({ id, quantity: 1 }));
  };

  const handleRemoveFromCart = () => {
    const item = cartItems.find((item) => item.id == modalItem?.id);
    console.log(typeof ("This is the item.id type" + item?.id));
    if (item && item.quantity >= 1) {
      dispatch(removeItemFromCart(modalItem?.id));
      initiateToastAlert(
        `${modalItem?.name} has been removed from cart`,
        "warning",
      );
      setModalItem(null);
    }
  };

  const handleRemoveClick = (id: string, name: string) => {
    setShowModal(true);
    console.log(id, name);
    const item = {
      id,
      name,
    };
    setModalItem(item);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    initiateToastAlert("Cart has been cleared successfully!", "warning");
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Please login to proceed with checkout",
        },
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Prepare order items in the required format
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      // Create order with required structure
      await createOrder.mutateAsync({
        userId: user.id,
        totalAmount: cartTotal,
        orderItems,
      });

      dispatch(clearCart());
      initiateToastAlert("Order placed successfully!", "success");
      navigate("/account/orders");
    } catch (error) {
      initiateToastAlert(
        error instanceof Error ? error.message : "Failed to create order",
        "error",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.currentPrice * item.quantity,
    0,
  );
  const shipping = 9.99;
  const cartTotal = subtotal + shipping;

  return (
    <main>
      <div className="space-y-4">
        <Breadcrumbs size="sm">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem>Cart</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-grow">
            {cartItems.length > 0 ? (
              <div className="flex flex-col p-4 rounded-lg shadow-md bg-white">
                <div className="w-full flex justify-between">
                  <h1 className="font-semibold capitalize text-lg">
                    cart items ({cartItems.length})
                  </h1>
                  <Button
                    color="danger"
                    size="sm"
                    onPress={() => {
                      setClearAll(true);
                      setShowModal(true);
                    }}
                  >
                    Clear cart
                  </Button>
                </div>
                <Divider className="my-2" />
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id}>
                      <div className="flex h-24 w-full">
                        <div className="flex h-full gap-4">
                          <div className="h-full overflow-hidden">
                            <img
                              src={item.imageUrl}
                              alt={`Thumbnail for ${item.name}`}
                              className="h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <h2>{item.name}</h2>
                            <p>variation: Big</p>
                          </div>
                        </div>
                        <div className="ml-auto flex flex-col items-center justify-between">
                          <p className="font-semibold">
                            Ksh {item.currentPrice * item.quantity}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Button
                              isIconOnly
                              variant="flat"
                              size="sm"
                              radius="full"
                              onPress={() => subtractQuantity(item.id)}
                            >
                              <FaMinus />
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              isIconOnly
                              variant="flat"
                              size="sm"
                              radius="full"
                              onPress={() => addQuantity(item.id)}
                            >
                              <FaPlus />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center ml-4">
                          <Button
                            isIconOnly
                            radius="full"
                            variant="light"
                            color="danger"
                            title="Remove"
                            size="sm"
                            onPress={() =>
                              handleRemoveClick(item.id, item.name)
                            }
                          >
                            <MdDeleteOutline />
                          </Button>
                        </div>
                      </div>
                      <Divider className="bg-background my-2" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-[50vh] shadow-md bg-white rounded-lg">
                <h3 className="text-xl capitalize">Your cart is empty!</h3>
                <p>Continue shopping, you should find something you like</p>

                <Button
                  variant="bordered"
                  className="mt-6"
                  color="primary"
                  onPress={() => navigate("/all-products")}
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="rounded-lg shadow-md bg-white p-4 sticky top-24 min-w-60 space-y-2">
              <h2 className="capitalize font-semibold">cart summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-primary">
                    Ksh {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-primary">
                    Ksh {shipping.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-medium text-primary">
                      Ksh {cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onPress={handleCheckout}
                color="secondary"
                className="w-full"
                isDisabled={cartItems.length === 0}
                isLoading={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : user
                    ? "Proceed to Checkout"
                    : "Login to Checkout"}
              </Button>

              <Button
                variant="bordered"
                className="mt-6 w-full"
                size="sm"
                color="primary"
                onPress={() => navigate("/all-products")}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
        <SimilarProducts title="You may like these" />
      </div>
      <Footer />
      <ConfirmationModal
        title={clearAll ? "Clear cart" : "Remove from cart"}
        description={`Are you sure you want to ${
          clearAll ? "clear the" : `remove ${modalItem?.name} from`
        } cart?`}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setClearAll(false);
        }}
        onConfirm={() => {
          if (clearAll) {
            handleClearCart();
          } else {
            handleRemoveFromCart();
          }
        }}
      />
    </main>
  );
};

export default Cart;
