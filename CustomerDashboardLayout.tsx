import React from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import SimilarProducts from "../components/SimilarProducts";
import { customerMenus } from "../utils/customerAsideMenus";

const CustomerDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-screen bg-background">
      <Navbar />
      <div className="container mx-auto md:px-8 lg:px-16 xl:px-40 space-y-4 mt-20 pt-4">
        <div className="flex gap-8">
          <aside className="bg-white rounded-lg p-4 shadow-md w-max h-max">
            <nav>
              <ul className="space-y-4">
                {customerMenus.map((menu) => (
                  <li>
                    <Link
                      key={menu.id}
                      to={menu.link}
                      className="capitalize hover:text-secondary p-2 text-sm font-medium"
                    >
                      {menu.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="flex-1 bg-white rounded-lg shadow-md  p-4 min-h-[60vh]">
            <Outlet />
          </div>
        </div>
        <SimilarProducts title="reccomended for you" />
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;
