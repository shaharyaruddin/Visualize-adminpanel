"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ResetForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
  });

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      user.password &&
      user.confirmPassword &&
      user.password === user.confirmPassword &&
      email
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [user, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (user.password !== user.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:1000/auth/resetpassword", {
        email: email,
        password: user.password,
      });

      if (res?.status === 200 || res?.status === 201) {
        alert("Password reset successful!");
        router.push("/login");
      }
    } catch (error) {
      console.error("error in reset password", error);
      if (error.response?.status === 400) {
        setError("Invalid reset request. Try again.");
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
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Please enter your new password below.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg p-2 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={user.confirmPassword}
              onChange={(e) =>
                setUser({ ...user, confirmPassword: e.target.value })
              }
              placeholder="Re-enter new password"
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

export default ResetForm;
