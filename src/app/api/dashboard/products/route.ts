import { connectDB } from "@/lib/db";
import { Product } from "@/database/models/Product";
import cloudinary from "@/lib/claudinary";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import * as yup from "yup";

const productSchema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio"),
  price: yup
    .number()
    .typeError("El precio debe ser un número")
    .required("El precio es obligatorio")
    .positive("El precio debe ser mayor a 0"),
  description: yup.string().required("La descripción es obligatoria"),
  stock: yup
    .number()
    .typeError("El stock debe ser un número")
    .min(0, "El stock no puede ser negativo"),
  category: yup.string(),
});

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    await connectDB();

    // Obtener FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const description = formData.get("description") as string;
    const stock = formData.get("stock") as string;
    const category = formData.get("category") as string;

    // Validar campos requeridos
    if (!name || !price || !description || !file) {
      return Response.json(
        {
          ok: false,
          error:
            "Faltan campos requeridos (name, price, description, file)",
        },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return Response.json(
        { ok: false, error: "El archivo debe ser una imagen" },
        { status: 400 }
      );
    }

    // Validar con yup
    try {
      await productSchema.validate(
        { name, price, description, stock, category },
        { abortEarly: false }
      );
    } catch (err: any) {
      return Response.json({ ok: false, error: err.errors }, { status: 400 });
    }

    // Convertir el archivo a buffer para Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir imagen a Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "e-commerce-aurinegro/products",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const imageUrl = (uploadResult as any).secure_url;

    // Crear el producto en la base de datos
    const newProduct = await Product.create({
      name,
      type: category || "Sin categoría",
      price: parseFloat(price),
      image: imageUrl,
      description,
      stock: stock ? parseInt(stock) : 0,
    });

    return Response.json({
      ok: true,
      message: "Producto creado exitosamente",
      product: newProduct,
    });
  } catch (error: any) {
    console.error("Error en POST /api/dashboard/products:", error);
    return Response.json(
      { ok: false, error: error.message || "Error al crear el producto" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const name = searchParams.get("name");

    const query: any = {};
    if (category) query.type = category;
    if (name) query.name = { $regex: name, $options: "i" };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return Response.json({
      ok: true,
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Error en GET /api/products:", error);
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
