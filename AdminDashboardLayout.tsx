import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const AdminDashboardLayout: React.FC = () => {
  document.title = "VQI - Admin";

  const isSidebarClosed = useSelector(
    (state: RootState) => state.sidebar.isSidebarClosed,
  );

  return (
    <div className="bg-background min-h-screen w-screen">
      <AdminSidebar />
      <main
        className={`${
          isSidebarClosed ? "ml-16" : "md:ml-64"
        } transition-all ease-in-out min-h-screen md:w-[calc(100vw-${isSidebarClosed ? "4rem" : "16rem"})]`}
      >
        <div className="w-full">
          <AdminNavbar />
          <div className="mt-16 px-8 py-4">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
