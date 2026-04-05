"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface QRGeneratorProps {
  id: string;
}

const QRGenerator = ({ id }: QRGeneratorProps) => {
  /* const baseUrl = "https://blin.vercel.app/admin/cobro/"; */
  const dominio = "http://localhost:3000";
  const baseUrl = `${dominio}/cobrador/cobro/123`;
  const fullUrl = `${baseUrl}${id}`;

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border">
      <QRCodeSVG value={fullUrl} size={256} level={"H"} includeMargin={true} />
      <p className="mt-4 text-sm text-gray-600 font-mono">ID: {id}</p>
    </div>
  );
};

export default function Page() {
  const [id, setId] = React.useState("");
  const [showQR, setShowQR] = React.useState(false);



  const handleGenerateQR = () => {
    if (id.trim()) {
      setShowQR(true);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Generador de Códigos QR</CardTitle>
          <CardDescription>
            Ingresa un ID para generar un código QR único
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="id-input">ID</Label>
            <Input
              id="id-input"
              placeholder="Ingresa el ID..."
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full"
            />
          </div>

          <Button
            onClick={handleGenerateQR}
            disabled={!id.trim()}
            className="w-full"
          >
            Generar Código QR
          </Button>

          {showQR && id.trim() && (
            <div className="mt-6">
              <QRGenerator id={id} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
