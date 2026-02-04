"use client"
import { useEffect, useState } from "react";
import { CartState } from "@/dto/CartState";
import { cartService, removeProductFromCart } from "@/services/cart";
import Image from "next/image";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { t } from "i18next";
import { toast } from "react-toastify";

export default function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRemoveFromCart = async (userId: string, productId: string) => {
    try {
      setLoading(true);
      const res = await removeProductFromCart(userId, productId);
      console.log(res.data);
      
      setCart((prevCart: any) => ({
        ...prevCart,
        carts: prevCart.carts.map((c: any) =>
          c.userId === userId
            ? {
                ...c,
                products: c.products.filter((p: any) => p.productId !== productId)
              }
            : c
        )
      }));
      
      toast.success("Producto eliminado del carrito");
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar producto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCartProduct = async () => {
      try {
        const res = await cartService();
        const data = res.data;
        console.log("Datos del carrito:", data);
        setCart(data);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar el carrito");
      }
    };

    getCartProduct();
  }, []);

  if (!cart || !cart.carts || cart.carts.length === 0) {
    return (
      <div className="p-10">
        <h2 className="text-xl font-bold mb-4 text-black text-center">Carrito de compras</h2>
        <p className="text-black text-center">El carrito está vacío.</p>
      </div>
    );
  }

  const currentCart = cart.carts[0];
  const userId = currentCart.userId;
  const products = currentCart.products || [];

  return (
    <div className="p-10">
      <h2 className="font-bold mb-4 text-[#000000c0] text-3xl text-center">Carrito de compras</h2>
      
      {products.length === 0 ? (
        <p className="text-black text-center">El carrito está vacío.</p>
      ) : (
        <article className="flex flex-wrap justify-center items-center text-center">
          {products.map((item: any) => (
            <Card 
              className="py-0 px-0 text-black w-[320px] shadow-2xl m-5 rounded-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300" 
              key={item.productId}
            >
              <CardHeader className="p-0 flex-col items-start">
                <div className="w-full h-[280px] bg-gray-100 flex items-center justify-center overflow-hidden">
                  <Image
                    alt={item.name}
                    className="object-cover w-full h-full"
                    src={item.image}
                    width={320}
                    height={280}
                  />
                </div>
                <div className="flex flex-col items-start p-4 w-full gap-2">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    {item.name}
                  </h3>
                  <h4 className="font-bold text-2xl text-green-600">
                    ${item.price}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 text-start line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardBody className="flex justify-center items-center text-center overflow-visible py-3 px-4">
                <button
                  onClick={() => handleRemoveFromCart(userId, item.productId)} // ← Usa userId del nivel superior
                  className="w-full bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : t("Remove") || "Eliminar"}
                </button>
              </CardBody>
            </Card>
          ))}
        </article>
      )}
      
      <div className="mt-6 text-center">
        <div className="bg-white p-6 rounded-lg shadow-lg inline-block">
          <p className="text-lg font-semibold mb-2">Total del carrito:</p>
          <p className="text-3xl font-bold text-green-600">
            ${products.reduce(
              (total: number, item: any) => total + item.price * item.quantity,
              0
            ).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
