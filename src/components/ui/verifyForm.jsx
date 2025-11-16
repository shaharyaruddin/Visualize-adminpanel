"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const VerifyForm = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(59);
  const [user, setUser] = useState({
    verificationCode: "",
  });

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const type = searchParams.get("type");

  useEffect(() => {
    console.log("email:", email);
    console.log("type:", type);
  }, [email, type]);

  useEffect(() => {
    if (!email) {
      router.push("/signup"); // ya error dikhao
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // cleanup function
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user.verificationCode) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await axios.post(`http://localhost:1000/auth/verify`, {
        code: user.verificationCode,
        email: email,
      });
      // console.log("verify response: ", res);

      if (type == "forgot") {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("error in verification form ", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Verify Your Account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          We’ve sent a verificationCode to your email. Please enter the
          verificationCode below to verify your account.
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Verification verificationCode */}
          <div>
            <label
              htmlFor="verificationCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Verification
            </label>
            <input
              type="text"
              id="verificationCode"
              value={user.verificationCode}
              onChange={(e) =>
                setUser({ ...user, verificationCode: e.target.value })
              }
              placeholder="Enter your 6-digit verificationCode"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="text-sm text-gray-600 mt-2 flex items-center justify-between">
            <span>Time remaining:</span>
            <span className="font-semibold text-red-500">
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>

          {/* Verify Button */}
          {timeLeft > 0 ? (
            <button
              type="submit"
              disabled={disabled}
              className=" w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Verify account
            </button>
          ) : (
            <button
              type="submit"
              className=" w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Resend OTP
            </button>
          )}
        </form>

        {/* Extra */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Didn’t receive the verificationCode?{" "}
          <a href="#" className="text-indigo-600 hover:underline">
            Resend verificationCode
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyForm;
