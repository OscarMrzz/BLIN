import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type OverleyModalProps = {
  open: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  style?: string;
};

export default function Modal({
  open,
  onClose,
  children,
  style,
}: OverleyModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (open) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  }, [open]);

  return (
    <>
      {open &&
        createPortal(
          <dialog
            ref={modalRef}
            onClose={onClose}

            className="m-auto flex items-center justify-center border-0 outline-none bg-transparent backdrop:bg-black/50 backdrop:backdrop-blur-sm animate-zoom-in duration-300"
          >
            <div
              className={`bg-secondary text-chart-1 rounded-2xl min-h-160 max-h-[90vh] w-[95vw] lg:w-xl flex flex-col shadow-2xl ${style}`}
            >
              <div className="h-full overflow-auto scrollbar-estetica p-6">
                {children}
              </div>
              <div className="flex justify-end p-4 border-t border-border">
                <button
                  onClick={onClose}
                  className="border-2 px-4 py-2 rounded-lg text-chart-1 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </dialog>,
          document.body
        )}
    </>
  );
}