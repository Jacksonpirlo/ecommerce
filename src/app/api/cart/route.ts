import { NextRequest } from "next/server";
import { Cart } from "@/database/models/Cart";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectDB();
  const { userId, product } = await req.json();

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, products: [product] });
  } else {
    const idx = cart.products.findIndex((p: any) => p.productId.toString() === product.productId);
    if (idx > -1) {
      cart.products[idx].quantity += product.quantity || 1;
    } else {
      cart.products.push(product);
    }
    await cart.save();
  }

  return Response.json({ ok: true, cart });
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.nextUrl.searchParams.get("userId");
    
    if (userId) {
      // Si viene userId, devuelve solo ese carrito
      const cart = await Cart.findOne({ userId });
      return Response.json({ ok: true, cart });
    } else {
      // Si NO viene userId, devuelve TODOS los carritos
      const carts = await Cart.find({});
      return Response.json({ ok: true, carts });
    }
  } catch (error: any) {
    console.error("Error en GET /api/cart:", error);
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { userId, productId } = await req.json();
  const cart = await Cart.findOne({ userId });
  if (!cart) return Response.json({ ok: false, error: "Carrito no encontrado" }, { status: 404 });

  cart.products = cart.products.filter((p: any) => p.productId.toString() !== productId);
  await cart.save();

  return Response.json({ ok: true, cart });
}