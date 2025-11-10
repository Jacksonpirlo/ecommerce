"use client";

import { useSession } from "next-auth/react";
import { Spinner } from "@heroui/react";
import LogoutButton from "@/components/atoms/LogoutButton";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" color="success" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-700">Plantas bonitas</h1>
            <p className="text-sm text-gray-600">Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            {session?.user && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ¡Bienvenido, {session?.user?.name}!
          </h2>
          <p className="text-gray-600">
            Has iniciado sesión exitosamente en tu panel de control.
          </p>
        </div>
      </main>
    </div>
  );
}