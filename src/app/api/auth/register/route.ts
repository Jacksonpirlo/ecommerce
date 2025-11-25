import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/database/models/User";
import bcrypt from "bcrypt";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validar que los campos existan
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 5) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 5 caracteres" },
        { status: 400 }
      );
    }


    await connectDB();

    const existingUser = await User.findOne({ email: email.trim() });

    if (existingUser) {
      return NextResponse.json(
        { message: "El usuario ya existe con ese correo electrónico" },
        { status: 409 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password.trim(), saltRounds);

    const newUser = new User({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });

    await newUser.save();

    try {
      const baseUrl = process.env.NEXTAUTH_URL;
      
      await axios.post(`${baseUrl}/api/sendEmail`, {
        email: newUser.email,
        asunto: "¡Bienvenido a Plantas bonitas!",
        mensajeHtml: `
          <div style="font-family: Arial; text-align: center; padding: 20px;">
            <h1 style="color: #16a34a;">¡Hola, ${newUser.name}!</h1>
            <p style="font-size: 16px; color: #333;">
              Gracias por crear tu cuenta en <b>Plantas bonitas</b>.
            </p>
            <p style="font-size: 14px; color: #666;">
              Tu cuenta ha sido creada exitosamente. Ya puedes iniciar sesión y explorar nuestro catálogo.
            </p>
            <a href="${baseUrl}/auth/login"
                style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #16a34a; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Iniciar sesión
            </a>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Error enviando el correo de bienvenida:", emailError);
    }

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
