"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SignupForm = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user.email && user.password && user.username) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`http://localhost:1000/auth/signup`, user);
      if (res.status == 200 || res.status == 201) {
        router.push(`/verify?email=${encodeURIComponent(user.email)}&type=signup`);
      }
    } catch (error) {
      console.error("error in signup form ", error);
      if (error?.response?.status == 403) {
        setError("user already exist");
      } else {
        setError("Something went wrong, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create an Account
          </h2>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/*  error message */}
            <div>
              {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                value={user.username}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={disabled}
              className=" w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Extra */}
          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
