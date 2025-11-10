"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface UseLogoutOptions {
  showToast?: boolean;
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function useLogout(options: UseLogoutOptions = {}) {
  const {
    showToast = true,
    redirectTo = "/auth/login",
    onSuccess,
    onError,
  } = options;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
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

      onSuccess?.();
      router.push(redirectTo);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      if (showToast) {
        toast.error("Error al cerrar sesión");
      }
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
}
