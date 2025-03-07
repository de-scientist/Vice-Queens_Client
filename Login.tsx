import React, { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import GoogleLogo from "../components/Google";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useFormik } from "formik";
import { object, string } from "yup";
import logo from "../assets/vice-queen-industries-favicon.png";
import FacebookLogo from "../components/Facebook";
import { userLogin } from "../services/useUser";
import { useMutation } from "@tanstack/react-query";
import initiateToastAlert from "../utils/Toster";
import apiRequest from "../utils/axiosInstance";
import { RootState, AppDispatch } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setLoading,
  setError,
  clearError,
} from "../store/slices/authStore";

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

interface LocationState {
  from: string;
  message?: string;
}

const Login: React.FC = () => {
  const [isPasswordInput, setIsPasswordInput] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { from, message } = (location.state as LocationState) || { from: "/" };
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const isError = useSelector((state: RootState) => state.auth.error);

  useEffect(() => {
    if (message) {
      initiateToastAlert(message, "info");
    }
  }, [message]);

  useEffect(() => {
    if (user) {
      navigate(from);
    }
  }, [user, navigate, from]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  interface FormValues {
    email: string;
    password: string;
  }

  const validation = object({
    email: string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: string().required("Password is required"),
  });

  const { mutate: handleUserLogin } = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({
    mutationFn: userLogin,
    onMutate: () => {
      dispatch(setLoading(true));
      dispatch(clearError());
    },
    onSuccess: (data: LoginResponse) => {
      setIsPasswordInput(false);

      dispatch(setUser({ user: data.user, token: data.token }));

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      document.cookie = `token=${data.token}; expires=${expiryDate.toUTCString()}; path=/; secure; samesite=strict`;

      apiRequest.defaults.headers.common["Authorization"] =
        `Bearer ${data.token}`;

      handleLoginForm.resetForm();

      initiateToastAlert(`Welcome back, ${data.user.firstname}😄`, "success");

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/all-products");
      }
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      setIsPasswordInput(true); // Keep password input visible on error
      console.error(err);
      dispatch(setError("🥹Login failed"));
      initiateToastAlert("🥹Login failed", "warning");
    },
    onSettled: () => {
      dispatch(setLoading(false));
    },
  });

  const handleLoginForm = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: (data) => {
      handleUserLogin(data);
    },
  });

  return (
    <div className="bg-white w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col space-y-4 w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/4">
        <Link to={"/"} className="flex justify-center">
          <img src={logo} width={70} alt="vice queens industries logo" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-2xl capitalize">welcome back</h1>
          <p className="">
            Enter your {isPasswordInput ? "password" : "email address"} to login
          </p>
        </div>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleLoginForm.handleSubmit}
        >
          {!isPasswordInput && (
            <div>
              <Input
                isInvalid={
                  handleLoginForm.errors.email && handleLoginForm.touched.email
                    ? true
                    : false
                }
                errorMessage={handleLoginForm.errors.email}
                label="Email"
                type="text"
                name="email"
                variant="bordered"
                color="secondary"
                size="sm"
                classNames={{ inputWrapper: ["border-secondary"] }}
                value={handleLoginForm.values.email}
                onChange={handleLoginForm.handleChange}
                onBlur={handleLoginForm.handleBlur}
              />
            </div>
          )}
          {isPasswordInput && (
            <div className="flex bg-[#d4d4d8] rounded-md p-2">
              <p>{handleLoginForm.values.email}</p>
              <Button
                size="sm"
                className="ml-auto capitalize text-secondary font-semibold"
                onPress={() => {
                  setIsPasswordInput(false);
                }}
              >
                edit
              </Button>
            </div>
          )}

          {isPasswordInput && (
            <div>
              <Input
                isInvalid={
                  handleLoginForm.touched.password &&
                  handleLoginForm.errors.password
                    ? true
                    : false
                }
                errorMessage={handleLoginForm.errors.password}
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="bordered"
                color="secondary"
                size="sm"
                name="password"
                classNames={{ inputWrapper: ["border-secondary"] }}
                value={handleLoginForm.values.password}
                onChange={handleLoginForm.handleChange}
                onBlur={handleLoginForm.handleBlur}
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? (
                      <div title="Hide password">
                        <IoEyeOff className="text-2xl text-default-400 pointer-events-none" />
                      </div>
                    ) : (
                      <div title="Show password">
                        <IoEye className="text-2xl text-default-400  pointer-events-none" />
                      </div>
                    )}
                  </button>
                }
              />
            </div>
          )}
          {isError && (
            <p className="text-xs text-danger uppercase text-center">
              {isError}
            </p>
          )}
          <Button
            type={isPasswordInput ? "submit" : "button"}
            className="capitalize font-semibold text-md"
            color="secondary"
            onPress={() => setIsPasswordInput(true)}
            isLoading={isLoading}
            isDisabled={
              !isPasswordInput &&
              (!!handleLoginForm.errors.email || !handleLoginForm.values.email)
            }
          >
            {isPasswordInput ? "login" : "continue"}
          </Button>
          <div className="flex items-center">
            <hr className="flex-grow border-secondary" />
            <span className="mx-2 text-sm capitalize">or continue with</span>
            <hr className="flex-grow border-secondary" />
          </div>
          <div className="flex justify-center space-x-2">
            <Button
              variant="bordered"
              color="secondary"
              startContent={<GoogleLogo />}
            >
              Google
            </Button>
            <Button
              variant="bordered"
              color="secondary"
              startContent={<FacebookLogo />}
            >
              Facebook
            </Button>
          </div>
          <div>
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
