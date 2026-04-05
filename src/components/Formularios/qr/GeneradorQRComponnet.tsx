import { QRCodeSVG } from "qrcode.react";

interface QRGeneratorProps {
  url: string;
  codigo: string;
}

export default function QRGenerator({ url, codigo }: QRGeneratorProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg">
      <QRCodeSVG value={url} size={256} level={"H"} includeMargin={true} />
      <p className="mt-2 text-sm text-gray-600 font-mono">{codigo}</p>
    </div>
  );
};


