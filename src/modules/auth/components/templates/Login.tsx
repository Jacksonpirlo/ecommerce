"use client"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // evita redirección automática
    });

    if(result?.status === 200) {
      router.push("/dashboard")
    }

    console.log(result);
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
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
