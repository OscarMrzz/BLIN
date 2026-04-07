import { QRCodeSVG } from "qrcode.react";

interface QRGeneratorProps {
  url: string;
  codigo: string;
}

export default function QRGenerator({ url, codigo }: QRGeneratorProps) {
  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100">
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <QRCodeSVG value={url} size={256} level={"H"} includeMargin={true} />
      </div>
      <div className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <p className="text-sm font-mono text-blue-700 font-semibold">
          {codigo}
        </p>
      </div>
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">Código QR generado</p>
      </div>
    </div>
  );
}
