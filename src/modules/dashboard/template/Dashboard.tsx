"use client";

import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  return (
    <>
    <div className="relative h-screen w-full overflow-hidden">
      
  <video
    src="video.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover -z-20"
  />

  {/* Overlay oscuro */}
  <div className="absolute inset-0 bg-black/60 -z-10" />

  {/* Contenido centrado */}
  <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-6">
    <div>
      <h1 className="text-5xl font-bold">{t("bienvenido")}</h1>
      <p className="text-xl mt-4">{t("mensaje")}</p>
    </div>
  </div>
</div>


    </>
  );
}