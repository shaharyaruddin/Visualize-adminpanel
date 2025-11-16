"use client";
import React, { useEffect, useState } from "react";
import DashboardCards from "@/components/DashboardCards";
import axios from "axios";

const Page = () => {
  const [blogs, setBlogs] = useState(0);
  const [portfolio, setPortfolio] = useState(0);
  const [category, setCategory] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        // Parallel requests for performance
        const [blogsRes, portfolioRes, categoryRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URI}/blogs`),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URI}/portfolio/portfolioLists`
          ),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URI}/category`),
        ]);
        setBlogs(blogsRes.data.TotalCount || 0);
        setPortfolio(portfolioRes.data.PorfolioList.length);
        setCategory(categoryRes.data.totalCategory);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    getData();
  }, []);

  return (
    <div className="w-full">
      <DashboardCards
        blogsCount={blogs}
        portfolioCount={portfolio}
        categoryCount={category}
      />
    </div>
  );
};

export default Page;
