import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: { email?: string; name?: string } }) {
      try {
        if (!user.email || !user.name) {
          console.error("Faltan datos de usuario para enviar el correo");
          return true;
        }
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        await axios.post(`${baseUrl}/api/sendEmail`, {
            email: user.email,
            asunto: "Bienvenido a Plantas bonitas",
            mensajeHtml: `
              <div style="font-family: Arial; text-align: center;">
                <h1>¡Hola, ${user.name}!</h1>
                <p>Gracias por iniciar sesión en <b>Plantas bonitas</b>.</p>
                <a href="${baseUrl}/dashboard"
                    style="padding: 10px 20px; background: #6b46c1; color: white; text-decoration: none; border-radius: 8px;">
                  Ir al dashboard
                </a>
              </div>
            `,});
      } catch (err) {
        console.error("Error enviando el correo:", err);
      }
      return true;
    },

    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/dashboard`;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
