"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState } from "react";
import { Spinner } from "@heroui/react";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  showToast?: boolean;
  redirectTo?: string;
}

export default function LogoutButton({ 
  className = "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition",
  children = "Cerrar sesión",
  showToast = true,
  redirectTo = "/auth/login"
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      if (showToast) {
        toast.info("Cerrando sesión...");
      }
      
      await signOut({
        redirect: false,
      });
      
      if (showToast) {
        toast.success("Sesión cerrada exitosamente");
      }
      
      router.push(redirectTo);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      if (showToast) {
        toast.error("Error al cerrar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`${className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" color="current" />
          Cerrando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
