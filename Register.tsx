import React, { useState } from "react";
import { Button, Input, Checkbox } from "@heroui/react";
import GoogleLogo from "../components/Google";
import { Link, useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useFormik } from "formik";
import { object, string, boolean } from "yup";
import logo from "../assets/vice-queen-industries-favicon.png";
import FacebookLogo from "../components/Facebook";
import initiateToastAlert from "../utils/Toster";
import { useRegister } from "../services/user.service";

const Register: React.FC = () => {
  const { mutate: register, isPending, error } = useRegister();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validation = object({
    firstname: string().required("Firstname is required"),
    lastname: string().required("Lastname is required"),
    email: string().email("Invalid email address").required("Email is required"),
    password: string().min(8, "Password must be at least 8 characters").required("Password is required"),
    termsAccepted: boolean().oneOf([true], "You must accept the terms and conditions"),
  });

  const handleRegisterForm = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      termsAccepted: false,
    },
    validationSchema: validation,
    onSubmit: async (data) => {
      try {
        await new Promise((resolve, reject) => {
          register(data, {
            onSuccess: () => {
              initiateToastAlert("Registration successful", "success");
              navigate("/login");
              resolve(true);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
              initiateToastAlert(`Registration failed: ${error.message}`, "warning");
              reject(error);
            },
          });
        });
      } catch (error) {
        console.error("Registration failed:", error);
      }
    },
  });

  return (
    <div className="bg-white w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col space-y-4 w-3/4 sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/4">
        <Link to="/" className="flex justify-center">
          <img src={logo} width={70} alt="Vice Queen Industries logo" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-2xl capitalize">Welcome</h1>
          <p>Fill in the following fields to register</p>
        </div>
        <form className="flex flex-col space-y-4" onSubmit={handleRegisterForm.handleSubmit}>
          {(["firstname", "lastname", "email", "password"] as const).map((field) => (
            <div key={field}>
              <Input
                isInvalid={!!handleRegisterForm.errors[field as keyof typeof handleRegisterForm.values] && !!handleRegisterForm.touched[field]}
                errorMessage={handleRegisterForm.errors[field as keyof typeof handleRegisterForm.values]}
                label={field.replace(/^\w/, (c) => c.toUpperCase())}
                type={field === "password" && !showPassword ? "password" : "text"}
                name={field}
                variant="bordered"
                color="secondary"
                size="sm"
                classNames={{ inputWrapper: ["border-secondary"] }}
                value={handleRegisterForm.values[field]}
                onChange={handleRegisterForm.handleChange}
                onBlur={handleRegisterForm.handleBlur}
                endContent={
                  field === "password" && (
                    <button aria-label="toggle password visibility" type="button" onClick={handleShowPassword}>
                      {showPassword ? <IoEyeOff className="text-2xl text-default-400" /> : <IoEye className="text-2xl text-default-400" />}
                    </button>
                  )
                }
              />
            </div>
          ))}

          <div>
            <Checkbox
              isInvalid={!!handleRegisterForm.errors.termsAccepted && !!handleRegisterForm.touched.termsAccepted}
              name="termsAccepted"
              color="secondary"
              size="sm"
              className="text-sm"
              isSelected={handleRegisterForm.values.termsAccepted}
              onChange={(e) => handleRegisterForm.setFieldValue("termsAccepted", e.target.checked)}
            >
              I agree to the <Link to="#">Terms & Conditions</Link>
            </Checkbox>
            {handleRegisterForm.touched.termsAccepted && handleRegisterForm.errors.termsAccepted && (
              <p className="text-xs text-[#f31260]">{handleRegisterForm.errors.termsAccepted}</p>
            )}
          </div>

          {error?.message && <p className="text-xs text-[#f31260] text-center">{error.message}</p>}

          <Button isLoading={isPending} type="submit" className="capitalize font-semibold text-md" color="secondary">
            {isPending ? "Creating account..." : "Create Account"}
          </Button>


          <div className="flex items-center">
            <hr className="flex-grow border-secondary" />
            <span className="mx-2 text-sm capitalize">or continue with</span>
            <hr className="flex-grow border-secondary" />
          </div>

          <div className="flex justify-center space-x-2">
            <Button variant="bordered" color="secondary" startContent={<GoogleLogo />}>
              Google
            </Button>
            <Button variant="bordered" color="secondary" startContent={<FacebookLogo />}>
              Facebook
            </Button>
          </div>

          <div>
            <p className="text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
