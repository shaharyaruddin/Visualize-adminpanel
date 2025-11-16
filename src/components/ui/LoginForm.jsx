"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const LoginForm = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (user.email && user.password) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`http://localhost:1000/auth/login`, user);

      if (res?.status === 200 || res?.status === 201) {
        const token = res?.data?.jwtToken;
        console.log('token: ', token)
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
        });

        // console.log("login response: ", res.data);
        // router.push("/");
      }
    } catch (err) {
      console.error("error in login form ", err);

      if (err.response) {
        setError(err.response.data?.message || "Authentication failed");
      } else if (err.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Login
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Please login to continue
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              required
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
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={disabled || loading}
            className="w-full flex items-center justify-center bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
