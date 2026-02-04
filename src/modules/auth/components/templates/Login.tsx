"use client";

import { Spinner } from "@heroui/react";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import imageLogin from "@/assets/images/mobileImage.png";
import Form from "../organisms/form";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success("¡Inicio de sesión exitoso!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        toast.error("Correo o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión", error);
      toast.error("Error al conectar con el servidor. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "email",
      type: "email",
      placeHolder: "Correo electrónico",
      placeholder: "Correo electrónico",
      text: "",
      value: email,
      className: "",
      onChange: (e: any) => setEmail(e.target.value),
    },
    {
      name: "password",
      type: "password",
      placeHolder: "Contraseña",
      placeholder: "Contraseña",
      text: "",
      value: password,
      className: "",
      onChange: (e: any) => setPassword(e.target.value),
    },
  ];

  return (
    <section>
      <div className="bg-[#f6f6f6]">
        <Image src={imageLogin} height={270} width={270} alt="Imagen login" className="p-0.1" />
      </div>

      <div className="">
        <h1 className="font-extrabold text-3xl text-center m-6 text-green-700">
          Plantas bonitas
        </h1>

        <Form
          titleOfTheForm="Iniciar sesión"
          fields={fields}
          btnText={loading ? <Spinner size="sm" color="success" /> : "Iniciar sesión"}
          onClick={() => handleLogin()}
          className=""
          isLogin={true}
          placeholder=""
          value=""
          btnDisabled={loading}
        />

        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push("/auth/register")}
            className="text-sm text-green-700 hover:underline"
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </div>
    </section>
  );
}
