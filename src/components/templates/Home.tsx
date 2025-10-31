"use client"
import ImageMobile from "@/assets/images/HomeImgMobile.jpeg";
import Button from "../atoms/Button";
import icon from "@/assets/svg/arrow.svg"
import { useRouter } from "next/navigation";

const HomeTemplate = () => {
    const router = useRouter();
 return(
    <section>
      <header style={{ backgroundImage: `url(${ImageMobile.src})`, height: 300, display: "flex", justifyContent:"center", alignItems:"center"}} className="bg-cover bg-center h-screen">
        <article className="">
            <div className="flex justify-center items-center gap-12">
            <Button className="flex items-center justify-between gap-2 bg-amber-50 text-black p-3 rounded-[8]" onClick={() => {router.push("/auth/login")}} text="Entrar" icon={icon}></Button>
            <Button className="flex items-center justify-between gap-2 bg-amber-50 text-black p-3 rounded-[8]" onClick={() => {router.push("/auth/register")}} text="Registrarme" icon={icon}/>
            </div>
        </article>
      </header>
      <main className="flex flex-col justify-center items-center m-6">
        <h1 className="font-extrabold text-green-700 text-4xl">Plantas Bonitas</h1>
        <p className="text-black mt-2">
            Tu espacio online dedicado a traer la naturaleza directamente a tu hogar. En Plantas bonitas, ofrecemos una cuidada selección de plantas de interior y exterior, herramientas especializadas y accesorios para jardinería, para que puedas crear y cuidar tu propio oasis verde.
            Ya seas un experto jardinero o un principiante que busca dar sus primeros pasos en el mundo de las plantas, aquí encontrarás todo lo que necesitas para hacer crecer tus conocimientos y tu jardín. Desde las plantas más exóticas hasta las más sencillas, cada una de ellas ha sido elegida por su belleza y resistencia, para que tu espacio sea único y lleno de vida.Tu espacio online dedicado a traer la naturaleza directamente a tu hogar. EnPlantas bonitas, ofrecemos una cuidada selección de plantas de interior y exterior,  
            herramientas especializadas y accesorios para jardinería, para que  puedas crear y cuidar tu propio oasis verde.
        </p>
      </main>
    </section>
 )
}

export default HomeTemplate;