"use client";
import * as React from "react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Gauge, Tag } from "lucide-react";

export function AppSidebar({ ...props }) {
  const [user, setUser] = React.useState({});

  const data = {
    user: {
      name: user.username,
      email: user.email,
      // name: 'coder' ,
      // email: 'coder',
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/",
        icon: Gauge,
      },

      {
        title: "Blogs",
        url: "#",
        icon: Tag,
        isActive: false,
        items: [
          {
            title: "Blogs",
            url: "/blogs",
          },
          {
            title: "Add Blogs",
            url: "/blogs/add",
          },
        ],
      },

      {
        title: "Portfolio",
        url: "#",
        icon: Tag,
        isActive: false,
        items: [
          {
            title: "Portfolios",
            url: "/portfolio",
          },
          {
            title: "Add Portfolios",
            url: "/portfolio/add",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="w-full flex justify-center items-center mt-3">
          <span className="group-data-[state=collapsed]:hidden">
            Visualize Solution Admin
          </span>
          <span className="hidden group-data-[state=collapsed]:inline">F</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} labelHeading="explore" />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
