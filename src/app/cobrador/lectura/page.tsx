"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { QrCode, CheckCircle, RefreshCw } from "lucide-react";


export default function QrScanner() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  

  useEffect(() => {
    // Ocultar elementos innecesarios del escáner pero mantener selección de cámara
    const style = document.createElement("style");
    style.textContent = `
      #reader button[title*="File"],
      #reader button[title*="Stop"],
      #reader .section__descriptions,
      #reader #dashboard__section__title {
        display: none !important;
      }
      #reader .qrbox {
        border: none !important;
      }
      #reader .dashboard {
        display: none !important;
      }
      /* Estilos para los botones de cámara */
      #reader button[title*="Switch camera"],
      #reader button[title*="Camera"] {
        display: block !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        padding: 8px 16px !important;
        margin: 4px !important;
        cursor: pointer !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
      }
      #reader button[title*="Switch camera"]:hover,
      #reader button[title*="Camera"]:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
      }
      /* Estilos para el selector de cámara */
      #reader select {
        display: block !important;
        background: white !important;
        border: 2px solid #e2e8f0 !important;
        border-radius: 8px !important;
        padding: 8px 12px !important;
        margin: 4px !important;
        color: #1a202c !important;
        font-weight: 500 !important;
        cursor: pointer !important;
        width: auto !important;
        min-width: 200px !important;
      }
      #reader select:hover {
        border-color: #667eea !important;
      }
      #reader select:focus {
        outline: none !important;
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
      }
      #reader option {
        display: block !important;
        color: #1a202c !important;
        padding: 8px !important;
      }
    `;
    document.head.appendChild(style);

    // Configuración del escáner
    const scanner = new Html5QrcodeScanner(
      "reader", // ID del elemento HTML
      {
        fps: 10,
        qrbox: { width: 400, height: 400 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0], // 0 = Cámara, 1 = Archivo
      },
      /* verbose= */ false,
    );

    const onScanSuccess = (decodedText: string) => {
      scanner.clear(); // Detiene el escáner tras una lectura exitosa
      setScanResult(decodedText);
      setIsScanning(false);
      setShowSuccess(true);

      // Redirigir a la URL escaneada
      if (decodedText) {
        // Verificar si es una URL válida
        try {
          const url = new URL(decodedText);
          window.location.href = url.toString();
        } catch {
          // Si no es una URL válida, intentar agregar http://
          try {
            const urlWithProtocol = decodedText.startsWith("http")
              ? decodedText
              : `https://${decodedText}`;
            const url = new URL(urlWithProtocol);
            window.location.href = url.toString();
          } catch {
            console.error("URL inválida:", decodedText);
            // Mostrar error pero mantener el resultado visible
            setTimeout(() => setShowSuccess(false), 3000);
          }
        }
      } else {
        setTimeout(() => setShowSuccess(false), 3000);
      }
    };

    const onScanFailure = (error: unknown) => {
      // Manejo de errores silencioso (se dispara continuamente si no hay QR)
      // console.warn(error);
    };

    scanner.render(onScanSuccess, onScanFailure);

    // Limpieza al desmontar el componente
    return () => {
      scanner
        .clear()
        .catch((error) => console.error("Error al limpiar el scanner", error));
    };
  }, []);

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
    setShowSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center h-full">
        {/* Header */}
        <div className="text-center mb-8 ">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-sky-500 to-orange-500 rounded-2xl shadow-lg">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Escáner QR</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Posiciona el código QR para escanear
          </p>
        </div>

        {/* Main Scanner Card */}
        <div className="max-w-2xl mx-auto ">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden ">
            {/* Scanner Status */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${isScanning ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}
                  ></div>
                  <span className="font-medium">
                    {isScanning ? "Escaneando..." : "Escaneo completado"}
                  </span>
                </div>
                {scanResult && (
                  <button
                    onClick={resetScanner}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Escanear otro</span>
                  </button>
                )}
              </div>
            </div>

            {/* Scanner Container */}
            <div className="p-4">
              {isScanning ? (
                <div className="relative ">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-orange-500 rounded-2xl opacity-20 blur-xl"></div>
                  <div className="relative rounded-2xl p-2 backdrop-blur-sm border">
                    <div id="reader" className="w-full"></div>
                  </div>
                  {/* Corner indicators */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-sky-400 rounded-tl-lg"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-sky-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-sky-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-sky-400 rounded-br-lg"></div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  </div>
                  <p className="text-lg font-medium mb-2">¡Escaneo exitoso!</p>
                  <p className="text-muted-foreground">
                    Código QR procesado correctamente
                  </p>
                </div>
              )}
            </div>

            {/* Result Display */}
            {scanResult && (
              <div
                className={`p-6 border-t border-white/10 transition-all duration-500 ${
                  showSuccess ? "bg-green-500/20" : "bg-white/5"
                }`}
              >
                <div className="flex items-start gap-4 ">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">
                      Resultado del escaneo
                    </h3>
                    <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                      <p className="text-green-400 font-mono text-sm break-all">
                        {scanResult}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          {isScanning && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                <p className="text-sm text-muted-foreground">
                  Mantén el código QR estable y bien iluminado
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
