"use client"
import { Spinner } from "@heroui/react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      // Login manual sin usar NextAuth
      const response = await axios.post("/api/auth/login", {
        email,
        password
      });

      const data = response.data;

      if (response.status === 200) {
        router.push("/dashboard");
      } else {
        console.error("Error en el inicio de sesión", data.message);
        alert(data.message || "Inicio de sesión fallido. Por favor, verifica tus credenciales.");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión", error);
      alert("Error al conectar con el servidor. Por favor, intenta nuevamente.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="text-black">
      <input className="" type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Iniciar sesión</button>
      <div>
        {/* Solo muestra el botón de Google, sin que aparezca otro botón adicional al hacer click */}
        <button
          type="button"
          onClick={() => signIn("google")}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border rounded-md hover:bg-gray-100 text-black">
          Iniciar con Google
        </button>
      </div>
    </form>
  );
}
