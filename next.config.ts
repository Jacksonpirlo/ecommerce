import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "example.com", // 👈 agrega este dominio
      "heroui.com",
      "images.unsplash.com",
       "plus.unsplash.com" // 👈 si ya lo habías agregado antes
    ],
  },
};

export default nextConfig;
