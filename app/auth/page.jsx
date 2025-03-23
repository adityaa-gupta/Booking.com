"use client";
import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import InputField from "../_components/InputField";
import useAuthStore from "../_store/useAuthStore";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Something went wrong");
      login(result.user, result.token);
      alert("Success!");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#E4EFE7]">
      <div className="relative w-full  bg-[#FDFAF6] h-[100vh] shadow-lg rounded-lg overflow-hidden flex">
        {/* Animated Left Section */}
        <motion.div
          key={isSignup ? "signup" : "login"}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex items-center justify-center w-1/2 bg-[#DFF0E7]"
        >
          <Image
            src={isSignup ? "/images/signup.svg" : "/images/login.svg"}
            width={400}
            height={400}
            alt="Auth Image"
            className="transition-opacity duration-500"
          />
        </motion.div>

        {/* Form Section */}
        <motion.div
          key={isSignup ? "signupForm" : "loginForm"}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-8"
        >
          <h2 className="text-3xl text-[#255F38] font-extrabold text-center mt-20 mb-6">
            {isSignup ? "Sign Up" : "Login"}
          </h2>

          <form
            className="space-y-4 w-full max-w-md mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            {isSignup && (
              <div className="flex gap-4">
                <InputField
                  label="First Name"
                  icon={<FaUser />}
                  placeholder="Enter first name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                <InputField
                  label="Last Name"
                  icon={<FaUser />}
                  placeholder="Enter last name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
              </div>
            )}
            <InputField
              label="Email"
              icon={<FaEnvelope />}
              placeholder="Enter Email"
              {...register("email", { required: "Email is required" })}
              error={errors.email?.message}
            />
            <InputField
              label="Password"
              icon={<FaLock />}
              placeholder="Enter Password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.password?.message}
            />
            {isSignup && (
              <>
                <InputField
                  label="Address"
                  icon={<FaMapMarkerAlt />}
                  placeholder="Enter Address"
                  {...register("address", { required: "Address is required" })}
                  error={errors.address?.message}
                />
                <InputField
                  label="Phone Number"
                  icon={<FaPhone />}
                  placeholder="Enter Phone Number"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  error={errors.phone?.message}
                />
              </>
            )}

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-[#1F7D53] text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition duration-200"
                disabled={loading}
              >
                {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
              </button>
            </div>

            <p
              className="text-center text-[#1F7D53] cursor-pointer mt-3 hover:underline"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign Up"}
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
