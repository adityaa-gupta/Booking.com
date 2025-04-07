'use client';
import Image from 'next/image';
import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
} from 'react-icons/fa';
import InputField from '../_components/InputField';
import useAuthStore from '../_store/useAuthStore';
import ApiService from '../_lib/services/ApiService';
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Separated component to handle redirect with useSearchParams
const AuthRedirect = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    if (isAuthenticated) {
      if (redirectUrl) {
        router.push(decodeURIComponent(redirectUrl));
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, redirectUrl, router]);

  return null;
};

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isSignup) {
        // Sign Up
        const token = await ApiService.register(data);
        toast.success('An email has been sent to you for verification');
        setIsSignup(false);
      } else {
        // Login
        const { token } = await ApiService.login(data);
        const userDetails = jwtDecode(token);

        const { role } = userDetails;
        login(userDetails, token); // Call login with the token
        toast.success('Login successful!');

        if (role[0] === 'ROLE_ADMIN') {
          router.push('/admin/events');
        } else {
          // Redirect will be handled by AuthRedirect component
          if (!isAuthenticated) {
            router.push('/');
          }
        }
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (response) => {
    try {
      const { credential } = response;
      console.log('Google Response:', credential); // The Google Token
      const { token } = await ApiService.googleOAuth(credential);
      const userDetails = jwtDecode(token);

      const { role } = userDetails;
      login(userDetails, token); // Call login with the token
      toast.success('Login successful!');
      router.push('/');
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };
  return (
    <GoogleOAuthProvider clientId="339934933735-d7o1cql31hrf32qdp663icafcv98fk8j.apps.googleusercontent.com">
      <div className="flex items-center justify-center bg-[#E4EFE7]">
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        {/* Wrap the component that uses useSearchParams in Suspense */}
        <Suspense fallback={null}>
          <AuthRedirect />
        </Suspense>
        <div className="relative w-full  bg-[#FDFAF6] h-[100vh] shadow-lg rounded-lg overflow-hidden flex">
          {/* Animated Left Section */}
          <motion.div
            key={isSignup ? 'signup' : 'login'}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center justify-center w-1/2 bg-[#DFF0E7]"
          >
            <Image
              src={isSignup ? '/images/signup.svg' : '/images/login.svg'}
              width={400}
              height={400}
              alt="Auth Image"
              className="transition-opacity duration-500"
            />
          </motion.div>

          {/* Form Section */}
          <motion.div
            key={isSignup ? 'signupForm' : 'loginForm'}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 p-8"
          >
            <h2 className="text-3xl text-[#255F38] font-extrabold text-center mt-20 mb-6">
              {isSignup ? 'Sign Up' : 'Login'}
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
                    {...register('firstName', {
                      required: 'First name is required',
                    })}
                    error={errors.firstName?.message}
                  />
                  <InputField
                    label="Last Name"
                    icon={<FaUser />}
                    placeholder="Enter last name"
                    {...register('lastName', {
                      required: 'Last name is required',
                    })}
                    error={errors.lastName?.message}
                  />
                </div>
              )}
              <InputField
                label="Email"
                icon={<FaEnvelope />}
                placeholder="Enter Email"
                {...register('email', { required: 'Email is required' })}
                error={errors.email?.message}
              />
              <InputField
                label="Password"
                icon={<FaLock />}
                placeholder="Enter Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
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
                    {...register('address', {
                      required: 'Address is required',
                    })}
                    error={errors.address?.message}
                  />
                  <InputField
                    label="Phone Number"
                    icon={<FaPhone />}
                    placeholder="Enter Phone Number"
                    {...register('phone', {
                      required: 'Phone number is required',
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
                  {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Login'}
                </button>
              </div>

              <p
                className="text-center text-[#1F7D53] cursor-pointer mt-3 hover:underline"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup
                  ? 'Already have an account? Login'
                  : "Don't have an account? Sign Up"}
              </p>
              <div className="mt-6">
                <GoogleLogin
                  onSuccess={handleGoogleSignIn}
                  onError={(error) =>
                    console.error('Google Login Failed:', error)
                  }
                />
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthPage;
