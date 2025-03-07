//These defines the Login Routes and the API response.
import apiRequest from "../utils/axiosInstance";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: "user" | "admin";
    avatar: string;
    createdAt: string;
  };
}

export const userLogin = async (details: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await apiRequest.post<LoginResponse>(
    `/api/auth/login`,
    details,
  );
  return response.data;
};
