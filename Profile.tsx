import { Button, Divider, Input } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { FiUser, FiLogOut } from "react-icons/fi";
import { MdOutlineEdit, MdSave } from "react-icons/md";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useLogout } from "../../services/auth.service";
import { clearAuth, updateProfile } from "../../store/slices/authStore";
import initiateToastAlert from "../../utils/Toster";

interface ProfileFormValues {
  firstname: string;
  lastname: string;
  phoneNo: string;
}

const AccountProfile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const logout = useLogout();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const profileSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(2, "Please write a valid name")
      .max(20, "The name should not exceed 20 caharacters")
      .required("First name is required"),
    lastname: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .required("Last name is required"),
    phoneNo: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must only contain numbers")
      .max(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
  });

  if (!user || isLoading) {
    return <Spinner size="md" color="primary" />;
  }

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      dispatch(clearAuth());
      // Remove auth cookie
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      initiateToastAlert("Logged out successfully", "success");
      navigate("/login");
    } catch (error) {
      initiateToastAlert("Logout failed", "error");
      console.error("Logout failed:", error);
    }
  };

  const handleUpdateProfile = async (
    values: ProfileFormValues,
    { setSubmitting }: FormikHelpers<ProfileFormValues>,
  ) => {
    try {
      // Add API call here to update profile
      dispatch(updateProfile(values));
      setIsEditing(false);
      initiateToastAlert("Profile updated successfully", "success");
    } catch (error) {
      initiateToastAlert("Update failed", "error");
      console.error("Update failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <FiUser className="text-xl" />
          <h2 className="text-lg font-semibold">My Account</h2>
        </div>
        <Button
          color="secondary"
          variant="flat"
          startContent={<FiLogOut />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4 border p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium capitalize">Personal Details</h4>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="secondary"
              onClick={() => setIsEditing(!isEditing)}
              title={isEditing ? "Save" : "Edit"}
            >
              {isEditing ? <MdSave /> : <MdOutlineEdit />}
            </Button>
          </div>
          <Divider />

          <Formik
            initialValues={{
              firstname: user?.firstname || "",
              lastname: user?.lastname || "",
              phoneNo: user?.phoneNo || "",
            }}
            validationSchema={profileSchema}
            onSubmit={handleUpdateProfile}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <div>
                  <Field
                    as={Input}
                    label="First Name"
                    name="firstname"
                    readOnly={!isEditing}
                    variant={isEditing ? "bordered" : "flat"}
                    color={
                      errors.firstname && touched.firstname
                        ? "danger"
                        : "secondary"
                    }
                    errorMessage={touched.firstname && errors.firstname}
                  />
                </div>

                <div>
                  <Field
                    as={Input}
                    label="Last Name"
                    name="lastname"
                    readOnly={!isEditing}
                    variant={isEditing ? "bordered" : "flat"}
                    color={
                      errors.lastname && touched.lastname
                        ? "danger"
                        : "secondary"
                    }
                    errorMessage={touched.lastname && errors.lastname}
                  />
                </div>

                <Input
                  label="Email"
                  value={user.email}
                  readOnly
                  disabled
                  variant="flat"
                />

                <div>
                  <Field
                    as={Input}
                    label="Phone Number"
                    name="phoneNo"
                    readOnly={!isEditing}
                    variant={isEditing ? "bordered" : "flat"}
                    color={
                      errors.phoneNo && touched.phoneNo ? "danger" : "secondary"
                    }
                    errorMessage={touched.phoneNo && errors.phoneNo}
                  />
                </div>

                {isEditing && (
                  <Button
                    type="submit"
                    color="secondary"
                    className="mt-4"
                    isLoading={isSubmitting}
                  >
                    Save Changes
                  </Button>
                )}
              </Form>
            )}
          </Formik>
        </div>

        <div className="flex flex-col gap-4 border p-6 rounded-lg shadow-sm">
          <h4 className="text-lg font-medium capitalize">
            Account Information
          </h4>
          <Divider />
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Type</p>
              <p className="capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
