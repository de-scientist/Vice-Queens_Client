//User services in global states and fetching from the API
import { useMutation, useQuery } from "@tanstack/react-query";
import apiRequest from "../utils/axiosInstance";

// interface LoginResponse {
//   message: string;
//   token: string;
//   user: {
//     id: string;
//     firstname: string;
//     lastname: string;
//     email: string;
//     role: "user" | "admin";
//     avatar: string;
//   };
// }

// //Provides service to login
// export const useLogin = () => {
//   return useMutation({
//     mutationFn: async (details: {
//       email: string,
//       password: string
//     }):Promise<LoginResponse> => {
//       const response = await apiRequest.post(`/api/auth/login`, details,);
//       return response.data
//     }
//   })
// }

//Provides servive to register
interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const registerUser = async (data: RegisterData): Promise<{ message: string }> => {
  const response = await fetch("http://localhost:3000/api/register", { // ✅ Ensure this matches backend URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include", // ✅ Ensure Fastify CORS allows credentials
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return response.json();
};


export const useRegister = () => {
  return useMutation<{ message: string }, Error, RegisterData>({
    mutationFn: registerUser,
  });
};
//Provides service to logout
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const { data } = await apiRequest.post(`/api/auth/logout`);
      return data;
    },
  });
};

//Provides service to get users
export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/api/users`);
      return data;
    },
  });
};

//Provides service to get user
export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await apiRequest.get(`/api/user`);
      return data;
    },
    enabled: !!id,
  });
};

//Provides service to update user
export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (userDetails: {
      firstname: string;
      lastname: string;
      phoneNo: string;
      avatar: string;
    }) => {
      const { data } = await apiRequest.put(`/api/user`, userDetails);
      return data;
    },
  });
};
