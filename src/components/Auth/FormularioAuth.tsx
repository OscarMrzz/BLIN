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
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClose = () => {
    setSeVaARegistrar(false);
    setStepRegistro(1);
    setIsError(false);
    setErrorMessage("");
    setIsLoading(false);
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
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    console.log("🔄 Formulario: Iniciando login", { email });

    try {
      const resultado = await login(email, password);

      if (resultado.error) {
        console.error("❌ Formulario: Error en login", resultado.error);
        setIsError(true);
        setErrorMessage(
          (resultado.error as { message?: string })?.message ||
            "Error al iniciar sesión",
        );
        return;
      }

      if (resultado.data) {
        console.log("✅ Formulario: Login exitoso");
        onClose();
        window.location.reload();
      } else {
        console.error("❌ Formulario: Login sin datos");
        setIsError(true);
        setErrorMessage("No se pudo iniciar sesión");
      }
    } catch (error) {
      console.error("❌ Formulario: Error inesperado en login", error);
      setIsError(true);
      setErrorMessage("Error inesperado al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
    const confirmPassword = event.currentTarget.confirmPassword?.value || "";
    const nombre = event.currentTarget.nombre?.value || "";
    const apellido = event.currentTarget.apellido?.value || "";

    console.log("🔄 Formulario: Iniciando registro", {
      email,
      nombre,
      apellido,
    });

    // Validar contraseñas
    if (password !== confirmPassword) {
      console.error("❌ Formulario: Las contraseñas no coinciden");
      setIsError(true);
      setErrorMessage("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    // Validar longitud mínima de contraseña
    if (password.length < 6) {
      console.error("❌ Formulario: Contraseña demasiado corta");
      setIsError(true);
      setErrorMessage("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const usuario = await register(email, password, nombre, apellido);

      if (usuario.error) {
        console.error(
          "❌ Formulario: Error al registrar usuario",
          usuario.error,
        );
        setIsError(true);
        setErrorMessage(
          (usuario.error as { message?: string })?.message ||
            "Error al registrar usuario",
        );
        return;
      }

      console.log("✅ Formulario: Registro exitoso");
      // Mostrar mensaje de éxito y cerrar
      alert(
        "¡Registro exitoso! Por favor revisa tu correo para confirmar la cuenta.",
      );
      onClose();
    } catch (error) {
      console.error(
        "❌ Formulario: Error inesperado al registrar usuario",
        error,
      );
      setIsError(true);
      setErrorMessage("Error inesperado al registrar usuario");
    } finally {
      setIsLoading(false);
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
                      <label className="block text-sm font-medium " htmlFor="">
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
                      <label className="block text-sm font-medium  " htmlFor="">
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
                      className="bg-sky-800 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registrando..." : "Registrarse"}
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
                className="bg-sky-700 rounded p-2 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
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
              {isError && (errorMessage || "Correo o contraseña incorrectos")}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}
