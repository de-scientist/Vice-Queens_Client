//Authenication Service APIs
import { useMutation } from "@tanstack/react-query";
import apiRequest from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../store/slices/user";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await apiRequest.post("/api/auth/login", credentials);
      dispatch(setUser(data.user));
      return data;
    },
    onSuccess: () => {
      navigate("/");
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiRequest.post("/api/auth/logout");
      dispatch(clearUser());
      return data;
    },
    onSuccess: () => {
      navigate("/login");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { data } = await apiRequest.post("/api/auth/register", credentials);
      return data;
    },
    onSuccess: () => {
      navigate("/login");
    },
  });
};
