import React, { useState, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { adminMenus } from "../utils/AdminAsideMenus";
import { Link } from "react-router-dom";
import * as LuIcons from "react-icons/lu";
import logo from "../assets/vice-queen-industries-favicon.png";
import LazyImage from "./LazyImage";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { setSidebarClosed } from "../store/slices/sidebar";
import { Button } from "@heroui/react";

const AdminSidebar: React.FC = () => {
  const isSidebarClosed = useSelector(
    (state: RootState) => state.sidebar.isSidebarClosed,
  );

  const dispatch = useDispatch<AppDispatch>();
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const getIcon = (iconName: string) => {
    return LuIcons[iconName as keyof typeof LuIcons] || MdKeyboardArrowDown;
  };

  const MenuIcon = getIcon("LuChevronsLeft");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setSidebarClosed(true));
      } else {
        dispatch(setSidebarClosed(false));
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    dispatch(setSidebarClosed(!isSidebarClosed));
    setActiveMenu(null);
  };

  const toggleMenu = (menuId: number) => {
    setActiveMenu(menuId);
    if (isSidebarClosed) {
      dispatch(setSidebarClosed(false));
    }
  };

  return (
    <aside
      className={`bg-primary  h-screen shadow-md transition-all ease-in-out fixed inset-y-0 left-0 z-50 top-0 ${
        isSidebarClosed ? "w-16 p-2" : "p-5 w-64"
      }`}
    >
      <nav className="space-y-4">
        <Link
          to={"/admin"}
          className="flex justify-between items-center"
          onClick={() => setActiveMenu(null)}
        >
          {!isSidebarClosed && (
            <div className="flex gap-4 items-center w-3/4">
              <LazyImage
                src={logo}
                alt="vice queen industries logo"
                height="12"
                width="12"
              />
              <span className="text-xl font-semibold text-secondary">V.Q</span>
            </div>
          )}
          <Button
            isIconOnly
            radius="full"
            onPress={toggleSidebar}
            variant="light"
          >
            <MenuIcon
              className={`transition-transform text-xl text-white ${
                isSidebarClosed ? "rotate-180" : "rotate-0"
              }`}
            />
          </Button>
        </Link>

        <ul className="space-y-2">
          {adminMenus.map((menu) => {
            const Icon = getIcon(menu.icon);
            return (
              <li key={menu.id}>
                <Link
                  to={menu.link}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === menu.link
                      ? "bg-blue-50 text-primary font-semibold"
                      : "text-white hover:bg-blue-50 hover:text-primary"
                  }`}
                  onClick={() => toggleMenu(menu.id)}
                >
                  <Icon className="text-xl" />
                  {!isSidebarClosed && (
                    <span className="flex-grow">{menu.title}</span>
                  )}
                  {menu.subMenus && !isSidebarClosed && (
                    <MdKeyboardArrowDown
                      className={`transition-transform ${
                        activeMenu === menu.id ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </Link>
                {menu.subMenus && (
                  <div
                    className={`sub-menu overflow-hidden transition-[max-height] duration-300 ${
                      activeMenu === menu.id ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <ul className="pl-8 space-y-2">
                      {menu.subMenus.map((submenu) => (
                        <li key={submenu.id}>
                          <Link
                            to={submenu.link}
                            className={`block p-2 rounded-lg transition-colors ${
                              location.pathname === submenu.link
                                ? "bg-blue-100 text-primary"
                                : "hover:bg-hover-clr text-white"
                            }`}
                          >
                            {submenu.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
