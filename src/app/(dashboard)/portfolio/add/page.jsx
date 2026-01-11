"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------------- SCHEMA ---------------- */
const formSchema = z.object({
  name: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"), // stores category _id
  description: z.string().min(5, "Description is required"),
  image: z.any().optional(),
});

const AddCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [categoryList, setCategoryList] = useState([]);
  const [portfolioList, setPortfolioList] = useState([]);
  const [loading, setLoading] = useState(false);

  // prevents reset loop in edit mode
  const hasPrefilled = useRef(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "", // category _id
      description: "",
      image: null,
    },
  });

  /* ---------------- FETCH CATEGORY + PORTFOLIO LIST ---------------- */
  const fetchInitialData = async () => {
    try {
      const [categoryRes, portfolioRes] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URI}/category`
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URI}/portfolio/portfolioLists`
        ),
      ]);

      setCategoryList(categoryRes.data.allCategories || []);
      setPortfolioList(portfolioRes.data.PorfolioList || []);
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  /* ---------------- PREFILL FORM (EDIT MODE – RUN ONCE) ---------------- */
  useEffect(() => {
    if (!id || portfolioList.length === 0 || hasPrefilled.current) return;

    const portfolio = portfolioList.find(
      (item) => item?._id === id
    );

    if (portfolio) {
      form.reset({
        name: portfolio.name || "",
        category: portfolio?.category || "",
        description: portfolio.description || "",
        image: null, // never prefill file input
      });

      hasPrefilled.current = true;
    }
  }, [id, portfolioList, form]);

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category); // send category _id
      formData.append("description", values.description);
      if (values.image) formData.append("image", values.image);

      if (id) {
        formData.append("_id", id);
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URI}/portfolio/updatePortfolio`,
          formData
        );
        toast.success("Portfolio updated successfully");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URI}/portfolio/addportfolio`,
          formData
        );
        toast.success("Portfolio added successfully");
      }

      router.push("/portfolio");
    } catch (error) {
      console.error("Submit error", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit" : "Add"} Portfolio</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              autoComplete="off"
            >
              {/* TITLE */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CATEGORY */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryList.map((item) => (
                          <SelectItem
                            key={item._id}
                            value={item.categoryName}
                          >
                            {item.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DESCRIPTION */}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* IMAGE */}
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
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BUTTONS */}
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading
                    ? "Processing..."
                    : id
                    ? "Update Portfolio"
                    : "Add Portfolio"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/portfolio")}
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

export default AddCategory;
