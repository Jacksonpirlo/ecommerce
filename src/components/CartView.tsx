import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CartView() {
  const { data: session } = useSession();
  const user = session?.user as { id?: string; name?: string; email?: string; image?: string };
  const [cart, setCart] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      axios.get(`/api/cart?userId=${user.id}`)
        .then(res => setCart(res.data.cart))
        .catch(() => toast.error("Error al cargar el carrito"));
    }
  }, [user]);

  const handleRemove = async (productId: string) => {
    try {
      const res = await axios.delete("/api/cart", {
        data: { userId: user.id, productId }
      });
      if (res.data.ok) {
        toast.success("Producto eliminado del carrito");
        setCart((prev: any) => ({
          ...prev,
          products: prev.products.filter((p: any) => p.productId !== productId)
        }));
      } else {
        toast.error("Error al eliminar del carrito");
      }
    } catch (error) {
      toast.error("Error al eliminar del carrito");
    }
  };

  return (
    <div>
      <h2>Carrito</h2>
      {cart && cart.products.length > 0 ? (
        <ul>
          {cart.products.map((p: any) => (
            <li key={p.productId} className="flex items-center gap-2 mb-2">
              <img src={p.image} alt={p.name} width={50} />
              {p.name} - ${p.price} x {p.quantity}
              <button
                onClick={() => handleRemove(p.productId)}
                className="bg-red-500 text-white px-2 py-1 rounded ml-2 cursor-pointer hover:bg-red-600 transition"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>El carrito está vacío.</p>
      )}
    </div>
  );
}