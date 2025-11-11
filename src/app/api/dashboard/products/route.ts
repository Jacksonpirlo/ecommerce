import { connectDB } from "@/lib/db"; // cambia la ruta según donde tengas tu archivo
import { Product } from "@/database/models/Product";

// 📩 POST → Crear un producto
export async function POST(req: any) {
  try {
    await connectDB();

    const text = await req.text();

    if (!text) {
      return Response.json(
        { ok: false, error: "No se recibió body" },
        { status: 400 }
      );
    }

    const { name, type, price, image, description } = JSON.parse(text);

    if (!name || !type || !price || !image || !description) {
      return Response.json(
        { ok: false, error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name,
      type,
      price,
      image,
      description,
    });

    return Response.json({
      ok: true,
      message: "Producto guardado correctamente",
      product: newProduct,
    });
  } catch (error: any) {
    console.error("Error en POST /api/products:", error);
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

// 📤 GET → Obtener todos los productos
export async function GET() {
  try {
    await connectDB();

    const products = await Product.find();

    return Response.json({
      ok: true,
      products,
    });
  } catch (error: any) {
    console.error("Error en GET /api/products:", error);
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
