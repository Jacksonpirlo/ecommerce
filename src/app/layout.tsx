"use client";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import NavbarTemplate from "@/components/templates/Navbar";
import { LanguageProvider } from "@/hooks/i18nContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>
          <LanguageProvider>
          <SessionProvider>
            <NavbarTemplate />
            {children}
          </SessionProvider>
          </LanguageProvider>
        </Providers>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
