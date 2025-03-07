import { FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import unauthorized from "../assets/noaccess.svg";

const Unauthorized: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md text-center">
        <img
          src={unauthorized}
          alt="Unauthorized Access"
          className="w-64 h-64 mx-auto mb-8"
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          Sorry, you don't have permission to access this page. Please contact
          your administrator or return to the homepage.
        </p>
        <Link to="/">
          <Button variant="solid" className="w-full">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
