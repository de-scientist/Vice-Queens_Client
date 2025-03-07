/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  LuDollarSign,
  LuUsers,
  LuShoppingBag,
  LuTrendingUp,
  LuArrowUpRight,
  LuArrowDownRight,
  LuClock,
  LuPackage,
} from "react-icons/lu";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { getAnalytics } from "../../services/adminAnalytics";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {
  setSalesData,
  setRevenueData,
  setRecentOrdersData,
  setLowStockData,
  setLoading,
  setError,
} from "../../store/slices/analyticsStore";
import ErrorUI from "../../components/ErrorUI";

interface User {
  firstname: string;
  lastname: string;
}

interface Order {
  id: string;
  user: User;
  createdAt: string;
  totalAmount: number;
  status: string;
}
interface Product {
  id: string;
  name: string;
  stock: number;
  threshold: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    salesData,
    revenueData,
    recentOrderData,
    lowStockData,
    isLoading,
    error,
  }: {
    salesData: any;
    revenueData: any;
    recentOrderData: Order[];
    lowStockData: any;
    isLoading: boolean;
    error: string | null;
  } = useSelector((state: RootState) => state.analytics);

  // Redirect if not admin
  React.useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  React.useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const [sales, revenue, recentOrders, lowStock] = await Promise.all([
          getAnalytics.sales(),
          getAnalytics.revenue(),
          getAnalytics.recentOrders(),
          getAnalytics.lowStock(),
        ]);
        dispatch(setSalesData(sales));
        dispatch(setRevenueData(revenue));
        dispatch(setRecentOrdersData(recentOrders));
        dispatch(setLowStockData(lowStock));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  if (isLoading) {
    return <Spinner size="md" color="primary" />;
  }

  if (error) {
    return <ErrorUI message={error} />;
  }
  // Calculate total revenue
  const totalRevenue = revenueData
    ? (revenueData.mpesa?.total || 0) + (revenueData.credit_card?.total || 0)
    : 0;

  const stats = [
    {
      name: "Total Revenue",
      value: `Ksh ${totalRevenue.toFixed(2)}`,
      change: "+20.1%",
      trend: "up",
      icon: <LuDollarSign className="w-6 h-6" />,
      loading: isLoading,
    },
    {
      name: "Total Orders",
      value: salesData?._count?.id || 0,
      change: "+12.4%",
      trend: "up",
      icon: <LuShoppingBag className="w-6 h-6" />,
      loading: isLoading,
    },
    {
      name: "Active Customers",
      value: "2,338",
      change: "15.3%",
      trend: "up",
      icon: <LuUsers className="w-6 h-6" />,
    },
    {
      name: "Conversion Rate",
      value: "3.24%",
      change: "-0.8%",
      trend: "down",
      icon: <LuTrendingUp className="w-6 h-6" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <Button color="primary">Download Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
            {stat.loading ? (
              <div className="flex justify-center items-center h-32">
                <Spinner size="md" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-50 rounded-lg">{stat.icon}</div>
                  <span
                    className={`flex items-center text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <LuArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <LuArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mt-4">
                  {stat.value}
                </h3>
                <p className="text-gray-600 mt-1">{stat.name}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Orders
              </h2>
              <LuShoppingBag className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            {isLoading ? (
              <Spinner size="lg" />
            ) : (
              <div className="space-y-4">
                {recentOrderData?.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.user.firstname} {order.user.lastname}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <LuClock className="w-4 h-4" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        Ksh {order.totalAmount}
                      </p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="light"
              color="primary"
              className="mt-6 w-full"
              onPress={() => navigate("/admin/orders")}
            >
              View All Orders
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Low Stock Products
              </h2>
              <LuPackage className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            {isLoading ? (
              <Spinner size="lg" />
            ) : (
              <div className="space-y-4">
                {lowStockData?.map((product: Product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">ID: {product.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-600">
                        {product.stock} in stock
                      </p>
                      <p className="text-sm text-gray-500">
                        Threshold: {product.threshold}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="light"
              color="primary"
              className="mt-6 w-full "
              onPress={() => navigate("/admin/products")}
            >
              View Stock
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
