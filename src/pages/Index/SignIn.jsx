import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate, NavLink } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { profileStore } from '../../store/Pfile_store';
import { request } from '../../utils/request';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const { funSetAccessToken, funSetUser, funSetPermission } = profileStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onFinish = async (values) => {
    const params = {
      email: values.username,
      password: values.password,
    };

    try {
      const res = await request("sign-in", "post", params);

      if (res && !res.error) {
        funSetAccessToken(res.access_token);
        funSetUser(res.user);
        funSetPermission(res.permission);

        toast.success("Login successful!");

        const roleRaw = res.user?.role;
        const role = typeof roleRaw === 'string'
          ? roleRaw.toLowerCase()
          : roleRaw?.name?.toLowerCase();

        // ✅ Delay redirect so toast can be seen
        setTimeout(() => {
          if (role === 'admin') {
            navigate("/");
          } else if (role === 'seller') {
            navigate("/");
          } else {
            navigate("/");
          }
        }, 1500); // Delay 1.5 seconds
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
        toast.error("Login failed: Invalid credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("An error occurred. Please try again later.");
      toast.error("An error occurred while logging in.");
    }
  };

  const handleSuccess = (credentialResponse) => {
    console.log("Google login success:", credentialResponse);
    toast.success("Google login successful!");

    // ✅ Optional: Navigate after success
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  const handleError = () => {
    console.error("Google login failed");
    setErrorMessage("Google login failed. Try again.");
    toast.error("Google login failed.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      {/* ✅ Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-8">
        <div className="text-start">
          <NavLink to="/" className="flex justify-start mb-4">
            <MdArrowBack className="h-6 w-6" />
          </NavLink>
        </div>

        <h2 className="text-2xl font-bold text-[#102249] text-start mb-1">Sign In</h2>
        <p className="text-gray-500 text-start mb-6">to get started</p>

        <GoogleOAuthProvider clientId="YOUR_CLIENT_ID_HERE">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </GoogleOAuthProvider>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-gray-500">or Sign in with Email</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          onFinish({ username: email, password });
        }}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-600 mb-2">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-600 mb-2">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="text-left mb-6">
            <a href="#" className="text-sm text-[#102249] hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#102249] text-white font-semibold rounded-lg hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Not registered yet?{" "}
          <a href="/signup" className="hover:underline font-medium">Create an account</a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
