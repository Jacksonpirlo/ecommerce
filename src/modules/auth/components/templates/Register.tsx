"use client";

import { Spinner } from "@heroui/react";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { toast } from "react-toastify";

import imageLogin from "@/assets/images/mobileImage.png";
import Form from "@/modules/auth/components/organisms/form";

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error');
    const googleEmail = searchParams.get('email');
    const googleName = searchParams.get('name');

    if (error === 'google_no_account' && googleEmail) {
      setEmail(googleEmail);
      if (googleName) {
        setName(googleName);
      }
      toast.info("No tienes cuenta. Por favor, completa tu registro.");
    }
  }, [searchParams]);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        toast.success("¡Registro exitoso! Se ha enviado un correo de bienvenida.");
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        toast.error(response.data.message || "Error al registrarse. Por favor, intenta nuevamente.");
      }
    } catch (error: any) {
      console.error("Error en el registro", error);
      const errorMessage = error.response?.data?.message || "Error al conectar con el servidor. Por favor, intenta nuevamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      type: "text",
      placeHolder: "Nombre",
      text: "",
      value: name,
      className: "",
      onChange: (e: any) => setName(e.target.value),
    },
    {
      type: "email",
      placeHolder: "Correo",
      text: "",
      value: email,
      className: "",
      onChange: (e: any) => setEmail(e.target.value),
    },
    {
      type: "password",
      placeHolder: "Contraseña",
      text: "",
      value: password,
      className: "",
      onChange: (e: any) => setPassword(e.target.value),
    },
  ];

  return (
    <>
      <div className="bg-[#f6f6f6]">
        <Image src={imageLogin} alt="Imagen registro" className="" />
      </div>

      <div className="mt-10">
        <h1 className="font-extrabold text-3xl text-center m-2 text-green-700">
          Plantas bonitas
        </h1>

        <Form
          titleOfTheForm="Registrarse"
          fields={fields}
          btnText={loading ? <Spinner size="sm" color="success" /> : "Crear cuenta"}
          onClick={() => handleRegister()}
          className=""
          isLogin={false}
          placeholder=""
          value=""
          btnDisabled={loading}
        />

        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push("/auth/login")}
            className="text-sm text-green-700 hover:underline"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </>
  );
}

const Register = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="success" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

export default Register;