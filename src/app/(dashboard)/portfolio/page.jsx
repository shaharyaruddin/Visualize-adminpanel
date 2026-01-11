"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Portfolio = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  const [portfolioList, setPortfolioList] = useState([]);

  const fetchPortfolioList = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URI}/portfolio/portfolioLists`
      );

      console.log("potfilio>>>>>>>>>>>>>>>", response?.data);

      setPortfolioList(response?.data?.PorfolioList);
    } catch (error) {
      console.log("error fetching in portfolio", err);
    }
  };

  useEffect(() => {
    fetchPortfolioList();
  }, []);

  const handleDelete = async () => {
    try {
      const payload = {
        Id: id,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URI}/portfolio/deletePortfolio`,
        payload
      );
      fetchPortfolioList();
      toast.success("Portfolio Delete Successfully");
    } catch (error) {
      console.log("error in delete portfolio", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Controlled modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this portfolio
            </DialogTitle>
          </DialogHeader>
          <p>This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                console.log("Confirmed delete");
                setOpen(false);
                handleDelete();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-4 w-full">
        <h2 className="text-xl font-semibold mb-4">Portfolio List</h2>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-white text-left">
              <tr>
                <th className="p-2 border text-black">ID</th>
                <th className="p-2 border text-black">Name</th>
                <th className="p-2 border text-black">Description</th>
                <th className="p-2 border text-black">Image</th>
                <th className="p-2 border text-black">Caegory</th>
                <th className="p-2 border text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolioList.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.description}</td>
                  <td className="p-2 border">
                    <div className="flex items-center gap-2">
                      {item?.image?.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`item-${index}`}
                          className="w-9 h-9 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="p-2 border">
                    {item.categoryDetail?.categoryName || "-"}
                  </td>
                  <td className="p-2 border">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/portfolio/add?id=${item?._id}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setOpen(true), setId(item?._id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
