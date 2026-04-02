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
      title: "Usuario",
      url: "#",
      icon: <UserIcon />,
      isActive: true,
      items: [
        {
          title: "Buscar",
          url: "#",
          icon: <Buscaricon />,
        },
        {
          title: "Favorito",
          url: "#",
          icon: <Favoritosicon />,
        },

        {
          title: "Estado de cuenta",
          url: "#",
          icon: <CashIcon />,
        },
        {
          title: "Recargar",
          url: "#",
          icon: <CreditCardIcon />,
        },
        {
          title: "Historial",
          url: "#",
          icon: <HistoryIcon />,
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
          title: "Usuarios",
          url: "#",
          icon: <UsersIcon />,
        },
        {
          title: "Rutas",
          url: "/admin/rutas",
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
          url: "#",
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
          {isAuthenticated && <NavMain items={data.navAdmin} />}
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
