"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import {Providers} from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
      <Providers>
        <SessionProvider>
        {children}
        </SessionProvider>
      </Providers>
      </body>
    </html>
  );
}
