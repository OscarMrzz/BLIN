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
      <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50">
        {seVaARegistrar ? (
          <div className="flex flex-col gap-8 px-6 w-full lg:px-16 py-8 h-full">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Crear cuenta
              </h2>
              <p className="text-slate-500 mt-2">Únete a BLIN hoy mismo</p>
            </div>

            <form className="flex-1" onSubmit={handleRegister}>
              {stepRegistro === 1 && (
                <div className="flex flex-col gap-6 w-full animate-fade-in">
                  <div className="space-y-4">
                    <div className="group">
                      <label
                        className="block text-sm font-semibold text-slate-700 mb-2"
                        htmlFor="nombre"
                      >
                        Nombre
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300 text-slate-700 placeholder-slate-400"
                        type="text"
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    <div className="group">
                      <label
                        className="block text-sm font-semibold text-slate-700 mb-2"
                        htmlFor="apellido"
                      >
                        Apellido
                      </label>
                      <input
                        id="apellido"
                        name="apellido"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300 text-slate-700 placeholder-slate-400"
                        type="text"
                        placeholder="Tu apellido"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={siguientePaso}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {stepRegistro === 2 && (
                <div className="flex flex-col gap-8 animate-fade-in">
                  <div className="space-y-4">
                    <div className="group">
                      <label
                        className="block text-sm font-semibold text-slate-700 mb-2"
                        htmlFor="email"
                      >
                        Correo electrónico
                      </label>
                      <input
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300 text-slate-700 placeholder-slate-400"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                    <div className="group">
                      <label
                        className="block text-sm font-semibold text-slate-700 mb-2"
                        htmlFor="password"
                      >
                        Contraseña
                      </label>
                      <input
                        id="password"
                        name="password"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300 text-slate-700 placeholder-slate-400"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        required
                      />
                    </div>
                    <div className="group">
                      <label
                        className="block text-sm font-semibold text-slate-700 mb-2"
                        htmlFor="confirmPassword"
                      >
                        Confirmar contraseña
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300 text-slate-700 placeholder-slate-400"
                        type="password"
                        placeholder="Repite tu contraseña"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between gap-4 mt-8">
                    <button
                      onClick={anteriorPaso}
                      className="px-6 py-3 border-2 border-slate-300 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 transition-all duration-200"
                    >
                      Anterior
                    </button>
                    <button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Registrando...
                        </span>
                      ) : (
                        "Completar registro"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="flex flex-col px-8 py-8 max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Bienvenido de vuelta
              </h2>
              <p className="text-slate-500">Inicia sesión para continuar</p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="group">
                  <label
                    className="block text-sm font-semibold text-slate-700 mb-2"
                    htmlFor="email"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300 text-slate-700 placeholder-slate-400"
                    placeholder="correo@ejemplo.com"
                    required
                    onInvalid={handleInvalidEmail}
                    onInput={handleInput}
                  />
                </div>
                <div className="group">
                  <label
                    className="block text-sm font-semibold text-slate-700 mb-2"
                    htmlFor="password"
                  >
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-slate-300 text-slate-700 placeholder-slate-400"
                    placeholder="Tu contraseña"
                    required
                    onInvalid={handleInvalidPassword}
                    onInput={handleInput}
                  />
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </form>

            <div className="text-center mt-6 space-y-4">
              <p className="text-slate-600">
                ¿No tienes cuenta?{" "}
                <button
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 underline underline-offset-2"
                  onClick={quiereregistrarse}
                >
                  Regístrate gratis
                </button>
              </p>

              {isError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake">
                  {errorMessage || "Correo o contraseña incorrectos"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
