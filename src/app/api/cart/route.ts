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
    // Si el producto ya está en el carrito, suma cantidad
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
  await connectDB();
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return Response.json({ ok: false, error: "userId requerido" }, { status: 400 });

  const cart = await Cart.findOne({ userId });
  return Response.json({ ok: true, cart });
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