import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/misUI/card";
import Link from "next/link";

export default function page() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Gestiona las cuentas de usuarios del sistema
          </CardDescription>
        </CardHeader>
      </Card>
      <Link href="/admin/rutas">
        <Card>
          <CardHeader>
            <CardTitle>Rutas</CardTitle>
            <CardDescription>
              Configura y gestiona las rutas de transporte
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Buses</CardTitle>
          <CardDescription>
            Administra la flota de buses y vehículos
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Estado de cuenta</CardTitle>
          <CardDescription>
            Revisa el estado financiero y transacciones
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Administrador de Tarjetas</CardTitle>
          <CardDescription>
            Emite y gestiona tarjetas de transporte
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reportes</CardTitle>
          <CardDescription>
            Genera y visualiza reportes del sistema
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
