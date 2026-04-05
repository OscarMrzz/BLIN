import React, { useEffect } from "react";

type OverleyModalProps = {
  open: boolean;
  onClose: () => void;
  titulo?: string;
  texto?: string;
};

export default function ApprovateMessage({
  open,
  onClose,
  titulo,
  texto,
}: OverleyModalProps) {
  const [Animar, setAnimar] = React.useState(false);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

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
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#10b981"
                  strokeWidth="2"
                />
                <path
                  d="M8 12l2 2 4-4"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
