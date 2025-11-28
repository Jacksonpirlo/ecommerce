import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db";
import { User as UserModel } from "@/database/models/User";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // <-- Aquí tipamos el retorno como 'any' para que TypeScript no lo marque
      async authorize(credentials): Promise<any | null> {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await UserModel.findOne({ email: credentials.email.trim() });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password.trim(), user.password);
        if (!isPasswordValid) return null;

        // Solo devolvemos los campos que necesitamos
        return {
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
