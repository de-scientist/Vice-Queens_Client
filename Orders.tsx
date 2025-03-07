import React, { useState, useEffect } from "react";
import { Tab, Tabs, Button } from "@heroui/react";
import {
  LuClock,
  LuTruck,
  LuCircleCheckBig,
  LuChevronDown,
} from "react-icons/lu";
import { BsCartCheck } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setOrders, setError, Order } from "../../store/slices/ordersSlice";
import { useGetOrders } from "../../services/orders.service";
import LazyImage from "../../components/LazyImage";
import Spinner from "../../components/Spinner";
import initiateToastAlert from "../../utils/Toster";

const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const { orders, error } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | Order["status"]>("all");

  const { data: userOrders, isLoading, isError } = useGetOrders(user?.id || "");

  useEffect(() => {
    if (userOrders) {
      dispatch(setOrders(userOrders));
    }
    if (isError) {
      dispatch(setError("Failed to fetch orders"));
      initiateToastAlert("Failed to fetch orders", "error");
    }
  }, [userOrders, isError, dispatch]);

  // Filter orders based on active tab
  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    return activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);

  const getStatusIcon = (status: Order["status"]) => {
    const icons = {
      pending: <LuClock className="text-blue-500" size={20} />,
      shipped: <LuTruck className="text-orange-500" size={20} />,
      delivered: <LuCircleCheckBig className="text-green-500" size={20} />,
    };
    return icons[status];
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-blue-100 text-blue-800",
      shipped: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
    };
    return colors[status];
  };

  if (isLoading) {
    return <Spinner size="lg" color="primary" />;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <BsCartCheck className="text-xl" />
        <h2 className="text-lg font-semibold">My Orders</h2>
      </div>

      <Tabs
        aria-label="Orders"
        selectedKey={activeTab}
        onSelectionChange={(key) => {
          setActiveTab(key as "all" | Order["status"]);
          setSelectedOrder(null);
        }}
        variant="light"
        color="primary"
      >
        <Tab key="all" title={`All (${orders?.length || 0})`} />
        <Tab
          key="pending"
          title={`Pending (${orders?.filter((o) => o.status === "pending").length || 0})`}
        />
        <Tab
          key="shipped"
          title={`Shipped (${orders?.filter((o) => o.status === "shipped").length || 0})`}
        />
        <Tab
          key="delivered"
          title={`Delivered (${orders?.filter((o) => o.status === "delivered").length || 0})`}
        />
      </Tabs>
      {filteredOrders.length > 0 ? (
        filteredOrders.map((order) => (
          <div key={order.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Order #{order.id}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>
              <Button
                onPress={() =>
                  setSelectedOrder(selectedOrder === order.id ? null : order.id)
                }
                className="font-medium"
                variant="light"
                size="sm"
                endContent={
                  <LuChevronDown
                    className={`text-lg transform transition-transform ${
                      selectedOrder === order.id ? "rotate-180" : ""
                    }`}
                  />
                }
              >
                Details
              </Button>
            </div>

            {selectedOrder === order.id && (
              <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Order Items
                </h4>
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <LazyImage
                      src={item.product.images[0] || "/placeholder.png"}
                      alt={`${item.product.name}`}
                      height="16"
                      width="16"
                      classNames="rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </h5>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          $
                          {(item.product.currentPrice * item.quantity).toFixed(
                            2,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">
                    Order Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-[#5D4E8C]">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Updated Tracking Information Section */}
                {order.delivery && order.delivery.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">
                      Tracking Information
                    </h4>
                    {order.delivery.map((delivery, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between mb-2"
                      >
                        <div className="flex items-center gap-2">
                          <LuTruck size={20} className="text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Tracking Number:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {delivery.trackingNumber}
                          </span>
                        </div>
                        <Button
                          variant="light"
                          color="primary"
                          size="sm"
                          className="font-medium"
                          onPress={() =>
                            window.open(
                              `/track/${delivery.trackingNumber}`,
                              "_blank",
                            )
                          }
                        >
                          Track Package
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center mt-4">No orders found.</p>
      )}
    </div>
  );
};

export default Orders;
