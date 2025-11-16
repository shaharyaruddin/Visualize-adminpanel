"use client";
import React, { useEffect, useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const Tools = () => {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getBlogs() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URI}/blogs`
        );

        console.log("resonse: ", res.data.AllBlogs);
        setBlogs(res.data.AllBlogs);
      } catch (err) {
        console.log("error fetching in blogs", err);
      }
    }
    getBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URI}/blogs/delete`,
        {
          Id: id,
        }
      );

      // console.log("response in deleting blogs: ", res);

      if (res.status == 200) {
        setBlogs((prev) => prev.filter((blogs) => blogs._id !== id));
      }
    } catch (err) {
      console.error("error in delting blogs: ", err);
    }
  };

  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4">Blogs</h2>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 dark:bg-black text-left">
            <tr className="">
              <th className="p-2 border ">ID</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Long Description</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((tool, index) => (
              <TableRow key={tool._id || index}>
                {/* ID */}
                <TableCell className="p-2 border">{index + 1}</TableCell>

                {/* Title */}
                <TableCell className="p-2 border">{tool.title}</TableCell>

                {/* Description */}
                <TableCell className="p-2 border">{tool.description}</TableCell>

                <TableCell className="p-2 border">
                  {tool.long_description}
                </TableCell>

                {/* Image */}
                <TableCell className="p-2 border">
                  {tool.image ? (
                    <img
                      src={tool.image}
                      alt="Blog"
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </TableCell>

                <TableCell className="p-2 border">
                  {tool.categoryName}
                </TableCell>

                {/* Created At */}
                <TableCell className="p-2 border">
                  {new Date(tool.createdAt).toLocaleDateString() || "N/A"}
                </TableCell>

                {/* Actions */}
                <TableCell className="p-2 border">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/blogs/add?id=${tool?._id}`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(tool._id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tools;
