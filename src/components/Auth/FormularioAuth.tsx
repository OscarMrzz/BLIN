import Modal from "@/components/modal/Modal";
import { login, register } from "@/lib/services/authServices";
import React from "react";
type Props = {
  open: boolean;
  onClose: () => void;
};

export default function FormularioAuth({ open, onClose }: Props) {
  const [seVaARegistrar, setSeVaARegistrar] = React.useState(false);
  const [stepRegistro, setStepRegistro] = React.useState(1);
  const [isError, setIsError] = React.useState(false);

  const handleClose = () => {
    setSeVaARegistrar(false);
    setStepRegistro(1);
    onClose();
  };

  const handleInvalidEmail = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity("Correo es obligatorio");
  };

  const handleInvalidPassword = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity("Contraseña es obligatoria");
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.setCustomValidity("");
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
     
      const resultado = await login(email, password);

      if (resultado.error) {
        setIsError(true);
      
        return;
      }

      if (resultado.data) {
        
        onClose();
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
      console.error("Error al iniciar sesion:", error);
    }
  };
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      const usuario = await register(email, password);
  
      onClose();
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  const quiereregistrarse = () => {
    setSeVaARegistrar(true);

  };

  const siguientePaso = () => {
    setStepRegistro(stepRegistro + 1);
  };

  const anteriorPaso = () => {
    setStepRegistro(stepRegistro - 1);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="h-full">
        {seVaARegistrar ? (
          <div className="flex flex-col  gap-8 px-2 w-full lg:px-24 py-12    h-full ">
            <h2 className="text-2xl font-bold ">Registrarse</h2>
            <form className="h-full" onSubmit={handleRegister}>
              {stepRegistro === 1 && (
                <div className="flex flex-col gap-4 w-full ">
                  <div className="flex flex-col gap-2 animate-slide-in-right">
                    <div>
                      <label
                        className="block text-sm font-medium "
                        htmlFor=""
                      >
                        Nombre
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        className="border border-slate-400 rounded px-2 py-1 w-full "
                        type="text"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium  "
                        htmlFor=""
                      >
                        Apellido
                      </label>
                      <input
                        id="apellido"
                        name="apellido"
                        className="border border-slate-400 rounded px-2 py-1 w-full "
                        type="text"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={siguientePaso}
                      className="bg-orange-500 text-white px-4 py-2 rounded"
                    >
                      siguiente
                    </button>
                  </div>
                </div>
              )}
              {stepRegistro === 2 && (
                <div className="flex flex-col gap-12">
                  <div className="animate-slide-in-right flex flex-col gap-2">
                    <div className="">
                      <label className="font-medium" htmlFor="">
                        Correo
                      </label>
                      <input
                        id="email"
                        name="email"
                        className="border border-slate-400 rounded px-2 py-1 w-full"
                        type="email"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-medium" htmlFor="">
                        Contraseña
                      </label>
                      <input
                        id="password"
                        name="password"
                        className="border border-slate-400 rounded px-2 py-1 w-full"
                        type="password"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-medium" htmlFor="">
                        Confirmar contraseña
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        className="border border-slate-400 rounded px-2 py-1 w-full"
                        type="password"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={anteriorPaso}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Anterior
                    </button>
                    <button
                      className="bg-sky-800 text-white px-4 py-2 rounded"
                      type="submit"
                    >
                      Registrarse
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="flex flex-col px-12 py-12">
            <h2>Iniciar sesion</h2>
            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
              <div className="flex flex-col gap-2">
                <label className="font-semibold " htmlFor="">
                  correo
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="border-2 border-slate-400 p-2 rounded "
                  required
                  onInvalid={handleInvalidEmail}
                  onInput={handleInput}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold " htmlFor="">
                  contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="border-2 border-slate-400 p-2 rounded "
                  required
                  onInvalid={handleInvalidPassword}
                  onInput={handleInput}
                />
              </div>
              <button
                className="bg-sky-700 rounded p-2 text-white"
                type="submit"
              >
                Iniciar sesion
              </button>
            </form>
            <span className="">
              No tienes cuenta?{" "}
              <button
                className="text-blue-400 cursor-pointer font-light"
                onClick={quiereregistrarse}
                
              >
                Registrate
              </button>
            </span>
            <span className="text-red-500">
              {isError && "Correo o contraseña incorrectos"}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}
