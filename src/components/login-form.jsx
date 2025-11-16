"use client"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { loginEndPoint } from "../../constraint/api/auth.route";

const formSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or username is required")
    .refine((val) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val) || val.length >= 3;
    }, "Must be a valid email or username (min 3 characters)"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const payload = emailRegex.test(values.identifier)
        ? { email: values.identifier, password: values.password }
        : { username: values.identifier, password: values.password };

      const response = await axios.post(loginEndPoint, payload, {
        timeout: 5000,
      });
      if (response.data.success) {
        const { token, user } = response.data;
        // Store token in cookie
        Cookies.set("authToken", token, { expires: 7 }); 
        Cookies.set("userInfo", JSON.stringify({
          username:user.username,
          name:user.name,
          email:user.email
        }), { expires: 7 }); 

        // Check role
        if (user.role.name === "admin") {
          toast.success("Login successful! Redirecting to admin dashboard.");
          router.push("/"); 
        } else {
          toast.error("Your role is not assigned for admin.");
          Cookies.remove("authToken"); 
          Cookies.remove("userInfo"); 
        }
      }
    } catch (error) {
      console.error("Login error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      if (error.response?.status === 409) {
        toast.error("Credentials do not match. Please try again.");
      } else {
        toast.error(
          error.response?.data?.message || "Failed to login. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email or username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                type="text"
                placeholder="m@example.com or username"
                {...form.register("identifier")}
                disabled={loading}
              />
              {form.formState.errors.identifier && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.identifier.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
                disabled={loading}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : "Login"}
              </Button>
            {" "}
              <a
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}