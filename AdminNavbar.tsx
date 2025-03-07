import React from "react";
import LazyImage from "./LazyImage";
import { Badge } from "@heroui/react";
import { MdOutlineNotifications } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const AdminNavbar: React.FC = () => {
  const isSidebarClosed = useSelector(
    (state: RootState) => state.sidebar.isSidebarClosed,
  );

  return (
    <div
      className={`bg-white fixed top-0 right-0 h-16 flex md:justify-between items-center px-6 transition-all ease-in-out w-full md:w-[calc(100vw-${
        isSidebarClosed ? "4rem" : "16rem"
      })]`}
    >
      <div>
        <h1 className="text-xl font-semibold">Welcome!</h1>
      </div>
      <div className="ml-auto flex gap-8 items-center ">
        <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
          <Badge color="danger" content="" shape="circle" size="sm">
            <MdOutlineNotifications className="text-2xl" />
          </Badge>
        </div>
        <div className="bg-black h-10 rounded-full overflow-hidden aspect-square">
          <LazyImage
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDJzEaxLN-jGRYYUO65pWu7Q9GXoNt4LUSSA&s"
            alt="user"
            width="full"
            height="full"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
