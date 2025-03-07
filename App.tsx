import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import Cart from "./pages/Cart";
import Category from "./pages/Category";
import Payment from "./pages/Payment";
import ProductPage from "./pages/ProductPage";
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));

import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import CustomerDashboardLayout from "./layouts/CustomerDashboardLayout";

import AdminProfile from "./pages/admin/AdminProfile";
import AppConfig from "./pages/admin/AppConfig";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import Inventory from "./pages/admin/Inventory";
import CustomerOrders from "./pages/customer/Orders";
import CustomerProfile from "./pages/customer/Profile";
import Wishlist from "./pages/customer/Wishlist";
import CustomerReviews from "./pages/customer/Reviews";
import Settings from "./pages/admin/Setting";
import EditWebContent from "./pages/admin/EditContent";
import AboutPage from "./pages/About";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/all-products" element={<AllProducts />} />

        <Route path="/admin/*" element={<AdminDashboardLayout />} />
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="category/:categoryId" element={<Category />} />
          {/* Protected checkout route */}
          <Route
            path="order/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route path="product/:productId" element={<ProductPage />} />
        </Route>

        {/* Protected admin routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<Inventory />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit" element={<EditProduct />} />
          <Route path="categories" element={<EditWebContent />} />
          <Route path="app-config" element={<AppConfig />} />
          <Route path="settings" element={<Settings />} />
          <Route path="edit-content" element={<EditWebContent />} />
        </Route>

        {/* Protected user routes */}
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <CustomerDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerProfile />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="reviews" element={<CustomerReviews />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
