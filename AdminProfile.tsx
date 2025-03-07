import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const AdminProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar}
            alt="Admin Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
