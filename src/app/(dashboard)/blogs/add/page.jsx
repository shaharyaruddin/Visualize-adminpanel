"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryName: z.string().min(1, "Category is required"),
  publishedDate: z.string().min(1, "Published date is required"),
  description: z.string().min(5, "Description is required"),
  long_description: z.string().min(10, "Description is required"),
  image: z.any().optional(),
});

const AddBlogs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      categoryName: "",
      publishedDate: "",
      description: "",
      long_description: "",
      image: null,
    },
  });

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URI}/category`
        );
        setCategories(response.data.allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to fetch categories");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Fetch all blogs for autofill when id is present
  useEffect(() => {
    async function fetchBlogsList() {
      if (id) {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URI}/blogs`
          );
          setBlogs(response.data.AllBlogs);
          // console.log(response.data.AllBlogs, "blogs---------------");
        } catch (error) {
          console.error("Error fetching blogs:", error);
          toast.error("Failed to fetch blog data");
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchBlogsList();
  }, [id]);

  const hasPrefilled = useRef(false);

  // Autofill form when blog data is fetched
  useEffect(() => {
    if (!id || blogs.length === 0 || hasPrefilled.current) return;

    const findBlogById = blogs.find((item) => item?._id === id);
    if (findBlogById) {
      form.reset({
        title: findBlogById.title || "",
        categoryName: findBlogById?.categoryName || "",
        description: findBlogById.description || "",
        long_description: findBlogById.long_description || "",
        image: null, // never prefill file input
        publishedDate: findBlogById.publishedDate
          ? new Date(findBlogById.publishedDate).toISOString().split("T")[0]
          : "",
      });

      hasPrefilled.current = true; // ✅ prevents future resets
    }
  }, [blogs, id, form]);

  // Handle form submission
  async function onSubmit(values) {
    try {
      if (id && !blogs.find((item) => item?._id === id)) {
        toast.error("Invalid blog ID");
        return;
      }
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("categoryName", values.categoryName);
      formData.append("publishedDate", values.publishedDate);
      formData.append("description", values.description);
      formData.append("long_description", values.long_description);
      if (values.image) formData.append("image", values.image);
      if (id) formData.append("_id", id);

      // Debug FormData
      console.log("FormData entries:", [...formData.entries()]);

      if (id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URI}/blogs/update`,
          formData
        );
        toast.success("Blog updated successfully!");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URI}/blogs/add`,
          formData
        );
        toast.success("Blog added successfully!");
      }
      router.push("/blogs");
    } catch (error) {
      console.error(
        "Error while adding/updating blog:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to process blog");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Update Blog" : "Add Blog"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
              className="space-y-6"
              autoComplete="off"
            >
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
                        type="text"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Published Date */}
              <FormField
                control={form.control}
                name="publishedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Published Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value ? new Date(field.value) : null}
                        onChange={(date) =>
                          field.onChange(
                            date ? date.toISOString().split("T")[0] : ""
                          )
                        }
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select a date"
                        className="w-full border rounded-md px-3 py-2"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((item, index) => (
                          <SelectItem key={index} value={item.categoryName}>
                            {item.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Long Description */}
              <FormField
                control={form.control}
                name="long_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter long description"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Processing..."
                    : id
                    ? "Update Blog"
                    : "Add Blog"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/blogs")}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlogs;
