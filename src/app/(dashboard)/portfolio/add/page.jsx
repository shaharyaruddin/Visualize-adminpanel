"use client";
import React, { useReducer, useEffect, useState } from "react";
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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchReducer } from "@/app/(api-response)/reducer/FetchReducer";
import { FETCH_INITIAL_STATE } from "@/app/(api-response)/states/FetchInitialState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(5, "Description is required"),
  image: z.any().optional(),
});

const AddCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  console.log("check id>>>", id);
  const [state, dispatch] = useReducer(fetchReducer, FETCH_INITIAL_STATE);
  const [categoryList, setCategoryList] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      category: "",
      description: "",
      image: null,
    },
  });

  async function onSubmit(values) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("description", values.description);
      formData.append("image", values.image);
      formData.append("_id", id);
      if (id) {
        const response = await axios.put(
          `${NEXT_PUBLIC_API_BASE_URI}/portfolio/updatePortfolio`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Portfolio Update Successfully");
      } else {
        const response = await axios.post(
          `${NEXT_PUBLIC_API_BASE_URI}/portfolio/addportfolio`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Portfolio Added Successfully");
      }
      router.push("/portfolio");
    } catch (error) {
      console.log("error while adding portfolio", error);
    }
  }

  const fetchPortfolioList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:1000/portfolio/portfolioLists"
      );
      setPortfolioData(response?.data?.PorfolioList);
    } catch (error) {
      console.log("error fetching in portfolio", err);
    }
  };

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URI}/category`
      );
      setCategoryList(response.data.allCategories);
    } catch (error) {
      console.log("error fetching in portfolio", err);
    }
  };

  useEffect(() => {
    fetchCategoryList();
    fetchPortfolioList();
  }, []);

  useEffect(() => {
    if (id) {
      fetchPortfolioList();
    }
  }, [id]);

  const isLoading = !state.LOADING;

  const findPortfolioById = portfolioData?.find((item) => item?._id === id);

  useEffect(() => {
    if (findPortfolioById) {
      form.reset({
        name: findPortfolioById.name || "",
        category: findPortfolioById?.categoryDetail?.categoryName || "",
        description: findPortfolioById.description || "",
        image: findPortfolioById.image || null,
      });
    }
  }, [findPortfolioById, form]);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit" : "Add"} Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values, event) =>
                onSubmit(values, event)
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              className="space-y-6"
              autoComplete="off"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
                        type="text"
                        {...field}
                        disabled={isLoading}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryList.map((item, index) => (
                            <SelectItem key={index} value={item.categoryName}>
                              {item.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        aria-describedby="description-error"
                        {...field}
                        disabled={isLoading}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage id="description-error" />
                  </FormItem>
                )}
              />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  {isLoading ? (
                    <>Processing...</>
                  ) : (
                    `${id ? "Update" : "Add "} Portfolio`
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/portfolio")}
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

export default AddCategory;
