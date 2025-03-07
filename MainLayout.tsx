import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mt-20 pt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
