"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react";

// This is sample data.
const data = {
  user: {
    name: "Sander",
    email: "sander@uth.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
  
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Usuario",
      url: "#",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "Buscar",
          url: "#",
        },
        {
          title: "Favorito",
          url: "#",
        },
      
        {
          title: "Estado de cuenta",
          url: "#",
        },
        {
          title: "Recargar",
          url: "#",
        },
        {
          title: "Historial",
          url: "#",
        },
      
      ],
    },
    {
      title: "Administracion",
      url: "#",
      icon: <BotIcon />,
      items: [
        {
          title: "usuarios",
          url: "#",
        },
        {
          title: "Rutas",
          url: "#",
        },
        {
          title: "Recargar",
          url: "#",
        },
        {
          title: "Estados de cuenta",
          url: "#",
        },
        {
          title: "Buses",
          url: "#",
        },
      ],
    },
  

  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
  <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      {/*   <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
