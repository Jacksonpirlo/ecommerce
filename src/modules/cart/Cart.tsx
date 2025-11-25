import { useCart } from "./CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Carrito de compras</h2>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <ul>
          {cart.map((item: any) => (
            <li key={item._id} className="flex justify-between items-center mb-2">
              <span>{item.name} - ${item.price}</span>
              <button onClick={() => removeFromCart(item._id)} className="text-red-500">Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && (
        <button onClick={clearCart} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">Vaciar carrito</button>
      )}
    </div>
  );
}
