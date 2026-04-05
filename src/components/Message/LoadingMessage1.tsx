import React, { useEffect, useState } from "react";

type OverleyModalProps = {
  open: boolean;
  onClose: () => void;
  titulo?: string;
  texto?: string;
};

export default function LoadingMessage1({
  open,
  onClose,
  titulo,
  texto,
}: OverleyModalProps) {
  const [Animar, setAnimar] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setAnimar(true);
      }, 10);
    } else {
      setTimeout(() => {
        setAnimar(false); // Reinicia la animación al cerrar
      }, 0);
    }
  }, [open]);

  return (
    <>
      {open ? (
        <div
          onClick={() => {
            onClose();
          }}
          className=" bg-gray-800/50 inset-0 z-100 fixed w-screen h-screen flex justify-center items-center"
        >
          <div
            className={` text-primario rounded-2xl flex flex-col justify-center items-center w-120 h-80 bg-[#ffffff] ${
              Animar ? "scale-100" : "scale-75"
            }  transition-all duration-500 ease-in-out`}
          >
            <div className="absolute top-0 h-60 w-60 overflow-hidden justify-center items-center">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="31.416"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-center absolute bottom-15">
              <h2 className="text-xl font-bold">{titulo}</h2>
              <p>{texto}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
