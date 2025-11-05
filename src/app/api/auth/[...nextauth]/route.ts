import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { User } from "@/database/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account", // Fuerza a seleccionar cuenta cada vez
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          await connectDB();
          const user = await User.findOne({ email: credentials.email.trim() });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password.trim(),
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      if (account?.provider === "google") {
        try {
          if (!user?.email) {
            console.error("Falta el email del usuario de Google");
            return false;
          }

          // Verificar si el usuario existe en la base de datos
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Usuario no existe, redirigir al registro
            // Guardamos el error en la URL para manejarlo en el cliente
            return `/auth/register?error=google_no_account&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || '')}`;
          }

          // Usuario existe, enviar correo de bienvenida
          const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
          await axios.post(`${baseUrl}/api/sendEmail`, {
            email: user.email,
            asunto: "Bienvenido a Plantas bonitas",
            mensajeHtml: `
              <div style=\"font-family: Arial; text-align: center;\">
                <h1>¡Hola, ${user.name}!<\/h1>
                <p>Gracias por iniciar sesión en <b>Plantas bonitas</b>.<\/p>
                <a href=\"${baseUrl}/dashboard\"
                    style=\"padding: 10px 20px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px;\">
                  Ir al dashboard
                <\/a>
              <\/div>
            `,
          });
        } catch (err) {
          console.error("Error en el callback signIn:", err);
        }
      }
      return true;
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Si la URL contiene el error de Google, redirigir al registro
      if (url.includes('error=google_no_account')) {
        return url;
      }
      // Por defecto, redirigir al dashboard
      return `${baseUrl}/dashboard`;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
