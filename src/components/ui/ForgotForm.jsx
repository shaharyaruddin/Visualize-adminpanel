"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ForgotForm = () => {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
  });

  useEffect(() => {
    if (user.email) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:1000/auth/forgot", {
        email: user.email,
      });

      if (res?.status === 200 || res?.status === 201) {
        // redirect to verify
        router.push(
          `/verify?email=${encodeURIComponent(user.email)}&type=forgot`
        );
      }
    } catch (error) {
      console.error("error in forgot password", error);

      if (error.response?.status === 404) {
        setError("This email does not exist in our system.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email and we’ll send you a link to reset your password.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg p-2 text-center">
            {error}
          </div>
        )}

        {/* Form */}
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
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={disabled || loading}
            className="w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
          >
            {loading ? (
              <span className="loader border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm text-indigo-600 hover:underline font-medium"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotForm;
