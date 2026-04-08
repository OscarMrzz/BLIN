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
} from "@/components/misUI/sidebar";
import {
  BusIcon,
  CreditCardIcon,
  HistoryIcon,
  SettingsIcon,
  UsersIcon,
  BarChartIcon,
  WalletIcon,
} from "lucide-react";
import UserIcon from "@/Icons/UserIcon";
import Buscaricon from "@/Icons/Buscaricon";
import Favoritosicon from "@/Icons/Favoritosicon";
import CashIcon from "@/Icons/CashIcon";
import CustomMapIcon from "@/Icons/MapIcon";
import { useAuth } from "@/hooks/UseAuthHook";
import { cerrarSesion, getUserAuth } from "@/lib/services/authServices";
import { getRolByUserId } from "@/lib/services/perfilesServices";
import FormularioAuth from "./Auth/FormularioAuth";
// This is sample data.
const data = {
  teams: [
    {
      name: "BLIN",
      logo: <BusIcon />,
      plan: "Transporte",
    },
  ],

  navMain: [
    {
      title: "Menú Principal",
      url: "#",
      icon: <UserIcon />,
      isActive: true,
      items: [
        {
          title: "Inicio",
          url: "/",
          icon: <Buscaricon />,
        },
      ],
    },
  ],
  navAdmin: [
    {
      title: "Administrador",
      url: "#",
      icon: <SettingsIcon />,
      isActive: true,
      items: [
        {
          title: "Perfiles",
          url: "/admin/perfiles",
          icon: <UsersIcon />,
        },
        {
          title: "Rutas",
          url: "/admin/rutas",
          icon: <CustomMapIcon />,
        },
        {
          title: "Stopping",
          url: "/admin/stopping",
          icon: <CustomMapIcon />,
        },
        {
          title: "horarios",
          url: "/admin/horarios",
          icon: <CustomMapIcon />,
        },

        {
          title: "Buses",
          url: "#",
          icon: <BusIcon />,
        },
        {
          title: "Estados de cuenta",
          url: "#",
          icon: <WalletIcon />,
        },
        {
          title: "Tarjetas",
          url: "/admin/tarjetas",
          icon: <CreditCardIcon />,
        },
        {
          title: "Generador QR",
          url: "/admin/generador-qr",
          icon: <CreditCardIcon />,
        },
        {
          title: "Reporte",
          url: "#",
          icon: <BarChartIcon />,
        },
      ],
    },
  ],
  navCobrador: [
    {
      title: "Cobrador",
      url: "#",
      icon: <SettingsIcon />,
      isActive: true,
      items: [
        {
          title: "lectura",
          url: "/cobrador/lectura",
          icon: <UsersIcon />,
        },
      ],
    },
  ],
  navAgente: [
    {
      title: "Recarga",
      url: "/recarga",
      icon: <SettingsIcon />,
      isActive: true,
      items: [
        {
          title: "Recarga",
          url: "/recarga/",
          icon: <UsersIcon />,
        },
      ],
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
  const [userRole, setUserRole] = React.useState<string>("");

  React.useEffect(() => {
    const usuarioObtenido = async () => {
      const usuarioEncontrado = await getUserAuth();
      if (!usuarioEncontrado) {
        setUserAuth(undefined);
        setUserRole("");
        return;
      }

      // Obtener el rol del usuario
      try {
        const rolInfo = await getRolByUserId(usuarioEncontrado.id);
        setUserRole(rolInfo?.nombre || "");
      } catch (error) {
        console.error("Error obteniendo rol:", error);
        setUserRole("");
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
          {isAuthenticated && userRole === "cobrador" && (
            <NavMain items={data.navCobrador} />
          )}
          {isAuthenticated && userRole === "agente" && (
            <NavMain items={data.navAgente} />
          )}
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
