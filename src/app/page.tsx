import RutaItem from "@/components/Rutas/RutaItem";
import { rutaInterface } from "@/Interfaces/rutas.iterface";
import Image from "next/image";

const rutasList: rutaInterface[] = [
  {
    idRuta: "1",
    ruta: "SPS - El Progreso",
    inicioRuta: "SPS",
    finRuta: "Progreso",
    paradasRuta: [
      {
        latitud: 14.5833,
        longitud: -90.5167,
        nombreLugar: "SPS",
      },
      {
        latitud: 14.5833,
        longitud: -90.5167,
        nombreLugar: "Progreso",
      },
    ],
    precioRuta: 0,
    tiempoEsperaRuta: 60*45,
    activo: "1",
    imagenBus: "/ruta1.png",
  },
  {
    idRuta: "2",
    ruta: "SPS - La lima",  
    inicioRuta: "SPS",
    finRuta: "La lima",
    paradasRuta: [
      {
        latitud: 14.5833,
        longitud: -90.5167,
        nombreLugar: "SPS",
      },
      {
        latitud: 14.5833,
        longitud: -90.5167,
        nombreLugar: "La lima",
      },
    ],
    precioRuta: 0,
    tiempoEsperaRuta: 60*30,
    activo: "1",
    imagenBus: "",
  },
  {
    idRuta: "3",
    ruta: "SPS-La pas",
    inicioRuta: "SPS",
    finRuta: "La pas",
    paradasRuta: [
      {
        latitud: 14.5833,
        longitud: -90.5167,
        nombreLugar: "SPS",
      },
      {
        latitud: 14.5833,
        longitud: -90.5167,
        nombreLugar: "La pas",
      },
    ],
    precioRuta: 0,
    tiempoEsperaRuta: 60*20,
    activo: "1",
    imagenBus: "",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col  h-full w-full  mx-auto ">
      <div className="w-full h-full   items-center flex flex-col gap-4 ">
        <div className="w-full h-60 flex justify-center ">
          <Image
            src="/logo2/logoCompleto.png"
            alt="Logo de la aplicación"
            width={100}
            height={100}
            priority
            className="w-auto h-auto border-2" // Fuerza a mantener el aspect ratio si hay estilos externos
            style={{ width: "auto", height: "auto" }} // Refuerzo para eliminar la advertencia de Next.js
          />
        </div>
        <div className="text-cyan-600">
          <p>Proximo Autobus</p>
        </div>
        <div className="text-6xl text-slate-700 font-bold">12:30 PM</div>
      </div>
      <div className="bg-orange-500  rounded-t-md h-32 p-2 mb-2">
        <h2 className="text-2xl font-bold text-slate-200">
          Rutas en tu ubicacion
        </h2>
      </div>
      <div className="flex flex-col w-full h-120 min-h-120 overflow-y-auto gap-2 pb-48 px-2 lg:px-8">
        {rutasList.map((ruta) => (
          <RutaItem key={ruta.idRuta} ruta={ruta} />
        ))}
      </div>
    </div>
  );
}
