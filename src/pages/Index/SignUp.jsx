import React, { useState } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { profileStore } from '../../store/Pfile_store';
import { request } from '../../utils/request';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const { funSetAccessToken, funSetUser, funSetPermission } = profileStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onFinish = async (values) => {
    const params = {
      name: values.name,
      email: values.email,
      password: values.password,
    };

    try {
      const res = await request("sign-up", "post", params);

      if (res && !res.error) {
        funSetAccessToken(res.access_token);
        funSetUser(res.user);
        funSetPermission(res.permission);

        toast.success("Sign up successful!");

        const roleRaw = res.user?.role;
        const role = typeof roleRaw === 'string'
          ? roleRaw.toLowerCase()
          : roleRaw?.name?.toLowerCase();

        setTimeout(() => {
          if (role === 'admin' || role === 'seller') {
            navigate("/");
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        setErrorMessage("Sign up failed. Please try again.");
        toast.error("Sign up failed.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setErrorMessage("An error occurred. Please try again later.");
      toast.error("An error occurred during sign up.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-8">
        <div className="text-start">
          <NavLink to="/" className="flex justify-start mb-4">
            <MdArrowBack className="h-6 w-6" />
          </NavLink>
        </div>

        <h2 className="text-2xl font-bold text-[#102249] text-start mb-1">Sign Up</h2>
        <p className="text-gray-500 text-start mb-6">to create an account</p>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={(e) => {
          e.preventDefault();
          onFinish({ name, email, password });
        }}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm text-gray-600 mb-2">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

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

          <button
            type="submit"
            className="w-full py-3 bg-[#102249] text-white font-semibold rounded-lg hover:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign up
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <NavLink to="/signin" className="hover:underline font-medium">Sign in</NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
