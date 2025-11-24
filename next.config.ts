import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
    MONGO_URI_ORIGEN: process.env.MONGO_URI_ORIGEN,
  },
  images: {
    domains: [
      'dhbpqrs.s3.us-east-2.amazonaws.com',
      'res.cloudinary.com',
      "example.com",
      "heroui.com",
      "images.unsplash.com",
      "plus.unsplash.com"
    ],
  },
   async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;