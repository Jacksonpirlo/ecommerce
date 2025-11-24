"use client";
export default function DashboardPage() {
  return (
    <>
    <div className="relative h-screen w-full overflow-hidden">

  {/* Video de fondo */}
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
      <h1 className="text-5xl font-bold">Bienvenido a plantas bonitas</h1>
      <p className="text-xl mt-4">Compre matas, no sea toche</p>
    </div>
  </div>
</div>


    </>
  );
}