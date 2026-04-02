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
import BotonSengInSengUp from "./Auth/BotonSengInSengUp";
import { useAuth } from "@/hooks/UseAuthHook";
import { cerrarSesion, getUserAuth } from "@/lib/services/authServices";
import FormularioAuth from "./Auth/FormularioAuth";
import { User } from "@supabase/supabase-js";
// This is sample data.
const data = {
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
  const { isAuthenticated } = useAuth();
  const [openFormularioAuth, setOpenFormularioAuth] = React.useState(false);
  const [userAuth, setUserAuth] = React.useState<
    | {
        name: string;
        email: string;
        avatar: string;
      }
    | undefined
  >(undefined);

  React.useEffect(() => {
    const usuarioObtenido = async () => {
      const usuarioEncontrado = await getUserAuth();
      if (!usuarioEncontrado) {
        setUserAuth(undefined);
        return;
      }
      const userParaEnviar = {
        name: "Usuario",
        email: usuarioEncontrado.email || "",
        avatar: "/avatars/shadcn.jpg",
      };

      setUserAuth(userParaEnviar);
    };
    usuarioObtenido();
  }, [isAuthenticated]);

  const abrirFormularioAuth = () => {
    if (isAuthenticated) {
      cerrarSesion();
      setOpenFormularioAuth(false);
      return;
    }
    setOpenFormularioAuth(true);
  };

  return (
    <>
      <FormularioAuth
        open={openFormularioAuth}
        onClose={() => setOpenFormularioAuth(false)}
      />
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <NavUser
            user={userAuth}
            onLogin={() => setOpenFormularioAuth(true)}
            onLogout={() => cerrarSesion()}
          />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {/*   <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
        <SidebarRail />
     
      </Sidebar>
    </>
  );
}
