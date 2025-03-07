import React from "react";
import Navbar from "../components/Navbar";
import { Tabs, Tab, Button, Input, DatePicker } from "@heroui/react";
import LazyImage from "../components/LazyImage";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FiShield } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useMutation } from "@tanstack/react-query";
import { initiatePayment, validatePhoneNumber } from "../services/payments";
import { useNavigate } from "react-router-dom";
import initiateToastAlert from "../utils/Toster";
import { useFormik } from "formik";
import * as Yup from "yup";
import { sendTransactionEmail } from "../services/emailService";

const Payment: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.currentPrice * item.quantity,
    0,
  );
  const shipping = 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const navigate = useNavigate();

  const { mutate: processPayment, isLoading: isProcessing } = useMutation({
    mutationFn: initiatePayment,
    onSuccess: async (response) => {
      try {
        // Send confirmation email
        await sendTransactionEmail({
          to: paymentForm.values.email,
          subject: "Order Confirmation",
          transactionDetails: {
            orderId: response.transactionId,
            items: cartItems,
            total: total,
            billingAddress: {
              firstname: paymentForm.values.firstname,
              lastname: paymentForm.values.lastname,
              email: paymentForm.values.email,
            },
          },
        });

        initiateToastAlert(
          "Payment successful! Check your email for confirmation.",
          "success",
        );
        navigate("/confirmation", {
          state: {
            transactionId: response.transactionId,
            status: response.status,
          },
        });
      } catch (error) {
        // Payment succeeded but email failed
        console.error("Failed to send confirmation email:", error);
        initiateToastAlert(
          "Payment successful! Email confirmation failed.",
          "warning",
        );
        navigate("/confirmation");
      }
    },
    onError: (error) => {
      initiateToastAlert("Payment failed. Please try again.", "error");
      console.error("Payment error:", error);
    },
  });

  const paymentValidation = Yup.object({
    phoneNumber: Yup.string().when("paymentMethod", {
      is: "mpesa",
      then: (schema) =>
        schema
          .required("Phone number is required")
          .matches(
            /^(?:254|\+254|0)([7][0-9]|[1][0-1])[0-9]{7}$/,
            "Invalid phone number format",
          ),
    }),
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const paymentForm = useFormik({
    initialValues: {
      phoneNumber: "",
      firstname: "",
      lastname: "",
      email: "",
      paymentMethod: "mpesa" as "mpesa" | "credit_card" | "paypal",
    },
    validationSchema: paymentValidation,
    onSubmit: async (values) => {
      try {
        const paymentData = {
          paymentMethod: values.paymentMethod,
          phoneNo:
            values.paymentMethod === "mpesa"
              ? validatePhoneNumber(values.phoneNumber)
              : undefined,
          amount: total,
          billingAddress: {
            firstname: values.firstname,
            lastname: values.lastname,
            email: values.email,
          },
        };

        const response = await processPayment(paymentData);

        if (response.success) {
          initiateToastAlert("Payment initiated successfully!", "success");
          navigate("/confirmation", {
            state: {
              transactionId: response.transactionId,
              status: response.status,
            },
          });
        }
      } catch (error) {
        initiateToastAlert(
          error instanceof Error ? error.message : "Payment failed",
          "error",
        );
      }
    },
  });

  return (
    <div className="min-h-screen w-screen bg-background">
      <Navbar />
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4 min-h-[95vh]">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-grow p-4 rounded-lg shadow-md bg-white space-y-4">
            <div className="flex items-center mb-8">
              <div className="flex items-center">
                <div className="bg-primary rounded-full h-6 w-6 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">1</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Cart
                </span>
              </div>
              <MdKeyboardArrowRight className="mx-4 text-gray-400" />
              <div className="flex items-center">
                <div className="bg-primary rounded-full h-6 w-6 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">2</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  Payment
                </span>
              </div>
              <MdKeyboardArrowRight className="mx-4 text-gray-400" />
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full h-6 w-6 flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-medium">3</span>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-400">
                  Confirmation
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold capitalize mb-2">payment method</h3>
              <form onSubmit={paymentForm.handleSubmit}>
                <Tabs
                  aria-label="Options"
                  color="primary"
                  variant="bordered"
                  selectedKey={paymentForm.values.paymentMethod}
                  onSelectionChange={(key) =>
                    paymentForm.setFieldValue("paymentMethod", key.toString())
                  }
                >
                  <Tab
                    key="mpesa"
                    title={
                      <div className="flex items-center space-x-2">
                        <LazyImage
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/M-PESA_LOGO-01.svg/1200px-M-PESA_LOGO-01.svg.png"
                          alt="mpesa logo"
                          height="8"
                          width="auto"
                        />
                      </div>
                    }
                  >
                    <h4 className="capitalize">mpesa</h4>
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        label="Phone Number"
                        variant="underlined"
                        color="primary"
                        placeholder="0712345678"
                        name="phoneNumber"
                        value={paymentForm.values.phoneNumber}
                        onChange={paymentForm.handleChange}
                        onBlur={paymentForm.handleBlur}
                        isInvalid={
                          !!(
                            paymentForm.touched.phoneNumber &&
                            paymentForm.errors.phoneNumber
                          )
                        }
                        errorMessage={paymentForm.errors.phoneNumber}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              +254
                            </span>
                          </div>
                        }
                      />
                    </div>
                  </Tab>
                  <Tab
                    key="videos"
                    title={
                      <div className="flex items-center space-x-2">
                        <LazyImage
                          src="https://res.cloudinary.com/dray10swl/image/upload/v1737837963/yezguurz6o1yvao97eee.png"
                          alt="visa mastercard logo"
                          height="8"
                          width="auto"
                        />
                      </div>
                    }
                  >
                    <h4 className="capitalize">credit card</h4>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <Input
                          className="w-3/4"
                          type="number"
                          maxLength={3}
                          label="Card Number"
                          variant="underlined"
                          color="primary"
                        />
                        <Input
                          className="flex-1"
                          type="number"
                          label="CVC"
                          variant="underlined"
                          color="primary"
                        />
                      </div>
                      <div>
                        <DatePicker
                          label="Experition Date"
                          variant="underlined"
                          color="primary"
                        />
                      </div>
                    </div>
                  </Tab>
                  <Tab
                    key="music"
                    title={
                      <div className="flex items-center space-x-2">
                        <LazyImage
                          src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
                          alt="paypal logo"
                          height="8"
                          width="auto"
                        />
                      </div>
                    }
                  >
                    Paypal
                  </Tab>
                </Tabs>

                <div>
                  <h3 className="font-semibold">Billing Address</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          variant="underlined"
                          color="primary"
                          label="First name"
                          name="firstname"
                          type="text"
                          value={paymentForm.values.firstname}
                          onChange={paymentForm.handleChange}
                          onBlur={paymentForm.handleBlur}
                          isInvalid={
                            !!(
                              paymentForm.touched.firstname &&
                              paymentForm.errors.firstname
                            )
                          }
                          errorMessage={paymentForm.errors.firstname}
                        />
                      </div>
                      <div>
                        <Input
                          variant="underlined"
                          color="primary"
                          label="Last Name"
                          name="lastname"
                          type="text"
                          value={paymentForm.values.lastname}
                          onChange={paymentForm.handleChange}
                          onBlur={paymentForm.handleBlur}
                          isInvalid={
                            !!(
                              paymentForm.touched.lastname &&
                              paymentForm.errors.lastname
                            )
                          }
                          errorMessage={paymentForm.errors.lastname}
                        />
                      </div>
                    </div>
                    <div>
                      <Input
                        variant="underlined"
                        color="primary"
                        label="Email address"
                        name="email"
                        type="email"
                        value={paymentForm.values.email}
                        onChange={paymentForm.handleChange}
                        onBlur={paymentForm.handleBlur}
                        isInvalid={
                          !!(
                            paymentForm.touched.email &&
                            paymentForm.errors.email
                          )
                        }
                        errorMessage={paymentForm.errors.email}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center font-semibold mt-4">
                  <Button
                    color="secondary"
                    className="w-3/4"
                    isLoading={isProcessing}
                    type="submit"
                    isDisabled={!paymentForm.isValid || isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Pay Ksh ${total.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="p-4 rounded-lg shadow-md bg-white max-h-max sticky top-24 space-y-4">
            <h3 className="capitalize font-semibold">Order Summary</h3>
            <div className="space-y-4 ">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    Ksh {(item.currentPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>Ksh {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span> Ksh {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>Ksh {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>Ksh {total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <FiShield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">
                    Order Protection
                  </h4>
                  <p className="mt-1 text-sm text-blue-700">
                    Your order is protected by our secure payment system and
                    buyer protection policy.
                  </p>
                </div>
              </div>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
