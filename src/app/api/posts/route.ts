import { connectDB } from "@/lib/db";
import { Events } from "@/database/models/event";
import cloudinary from "@/lib/claudinary";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("image") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;

    if (!title || !description || !category || !file) {
      return Response.json(
        { error: "Faltan campos o imagen" },
        { status: 400 }
      );
    }

    console.log("Archivo recibido:", file.name, file.type, file.size);

    // Convertir el archivo a buffer para Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convertir buffer a base64 data URI (método alternativo más seguro)
    const base64Image = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Image}`;

    console.log("DataURI creado, tamaño:", dataURI.length);

    // Subir imagen a Cloudinary usando upload con data URI
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: "posts",
      use_filename: true,
      resource_type: "image",
    });

    console.log("Imagen subida a Cloudinary:", uploadResult.secure_url);

    const imageUrl = uploadResult.secure_url;

    // Guardar en la base de datos
    const newEvent = await Events.create({
      title,
      description,
      category,
      img: imageUrl,
    });

    return Response.json({
      message: "Nuevo evento registrado",
      event: newEvent,
    });
  } catch (err: any) {
    console.error(err);
    return Response.json(
      { error: "Error subiendo la imagen" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/api/hello") {
    return Response.json({ message: "funciona" });
  }

  if (path === "/api/jackson") {
    const object = {
      name: "papitas de limon",
      price: 2000,
      amount: 1,
    };

    return Response.json(object);
  }

  return Response.json({ error: "Ruta no encontrada" }, { status: 404 });
}