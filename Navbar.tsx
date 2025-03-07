import React, { useState } from "react";
import logo from "../assets/vice queen industries logo.jpg";
import { FiUser } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { IoCartOutline, IoClose, IoMenu } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Input, Button } from "@heroui/react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Navbar: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  const handleProductSearch = async () => {
    if (searchKeyword.trim()) {
      navigate(`/all-products?q=${encodeURIComponent(searchKeyword.trim())}`);
      setSearchKeyword("");
    } else {
      navigate("/all-products");
    }
  };

  const renderAuthSection = () => {
    if (isAuthenticated) {
      return (
        <Link to="/account" className="flex items-center space-x-1">
          <FiUser className="text-2xl text-gray-600" />
          <span>Account</span>
        </Link>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Button
          as={Link}
          to="/login"
          variant="solid"
          color="secondary"
          className="font-medium"
        >
          Login
        </Button>
        <Button
          as={Link}
          to="/register"
          variant="solid"
          color="secondary"
          className="font-medium"
        >
          Sign up
        </Button>
      </div>
    );
  };

  return (
    <header className="bg-white shadow top-0 fixed w-screen z-50">
      <nav className="flex items-center justify-between h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 hover:bg-background rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <IoClose className="text-2xl text-gray-600" />
            ) : (
              <IoMenu className="text-2xl text-gray-600" />
            )}
          </button>
          <Link to={"/"}>
            <div className="h-20 w-20">
              <img
                src={logo}
                alt="vice queen industries logo"
                className="object-cover h-full w-full"
              />
            </div>
          </Link>

          <ul className="hidden lg:flex justify-center space-x-6 text-gray-700 hover:text-primary transition-colors">
            <li>
              <Link to="/all-products">Products</Link>
            </li>
            <li>
              <Link to="/trends">Leasing</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        {isMenuOpen && (
          <div className="">
            <div
              className="fixed inset-0"
              onClick={() => setIsMenuOpen(false)}
            />
            <nav className="fixed top-20 left-0 bottom-0 w-52 bg-white">
              <div className="pt-4 pb-6 px-6">
                <div className="space-y-4">
                  <Link
                    to={"/"}
                    className="block text-gray-700 hover:text-[#5D4E8C]"
                  >
                    Home
                  </Link>
                  <Link
                    to={"/"}
                    className="block text-gray-700 hover:text-[#5D4E8C]"
                  >
                    Whats New
                  </Link>
                  <Link
                    to={"/"}
                    className="block text-gray-700 hover:text-[#5D4E8C]"
                  >
                    Delivery
                  </Link>
                  <Link
                    to={"/"}
                    className="block text-gray-700 hover:text-[#5D4E8C]"
                  >
                    About
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}

        <div className="w-[30rem] lg:w-[20rem] xl:w-[30rem] hidden md:block">
          <Input
            placeholder="Search for products"
            className="onfocus:w-[100px] text-lg"
            size="md"
            variant="bordered"
            color="secondary"
            onChange={handleChange}
            value={searchKeyword}
            endContent={
              <div
                className="cursor-pointer text-2xl p-2 hover:text-secondary"
                onClick={handleProductSearch}
              >
                <CiSearch />
              </div>
            }
          />
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div>
            <Link to="/cart" className="flex items-center space-x-2">
              <Badge
                isInvisible={cartItems.length === 0}
                color="secondary"
                content={cartItems.length}
                shape="circle"
                size="sm"
              >
                <IoCartOutline className="text-2xl text-gray-600" />
              </Badge>
              <span className="capitalize">cart</span>
            </Link>
          </div>
          <div>{renderAuthSection()}</div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
