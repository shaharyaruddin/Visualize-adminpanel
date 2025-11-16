import React from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Layers2, LayoutGrid, User } from "lucide-react";

const DashboardCards = ({ blogsCount, portfolioCount, categoryCount }) => {
  const DASHBOARD_CARDS = [
    {
      heading: "total Blogs",
      count: blogsCount,
      icon: <User />,
    },
    {
      heading: "total Portfolios",
      count: portfolioCount,
      icon: <LayoutGrid />,
    },
    {
      heading: "total categories",
      count: categoryCount,
      icon: <Layers2 />,
    },
  ];
  return (
    <div className="grid grid-cols-3 max-md:grid-cols-1 w-full gap-3 ">
      {/* customers */}
      {DASHBOARD_CARDS.map((item, index) => {
        return (
          <Card className={"h-[9rem] capitalize"} key={index}>
            <CardHeader>
              <CardDescription>{item.heading}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {item.count}
              </CardTitle>
              <CardAction>{item.icon}</CardAction>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardCards;
