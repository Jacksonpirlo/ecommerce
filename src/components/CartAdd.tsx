// import { useState } from "react";

// export default function CartAdd() {
//   const [userId, setUserId] = useState("");
//   const [productId, setProductId] = useState("");
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState(0);
//   const [image, setImage] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [message, setMessage] = useState("");

//   const handleAdd = async () => {
//     const res = await fetch("/api/cart", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId,
//         product: { productId, name, price, quantity, image }
//       })
//     });
//     const data = await res.json();
//     setMessage(data.ok ? "Producto agregado al carrito" : "Error al agregar");
//   };

//   return (
//     <div>
//       <h2>Agregar producto al carrito</h2>
//       <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
//       <input placeholder="Product ID" value={productId} onChange={e => setProductId(e.target.value)} />
//       <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
//       <input placeholder="Precio" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
//       <input placeholder="Imagen" value={image} onChange={e => setImage(e.target.value)} />
//       <input placeholder="Cantidad" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
//       <button onClick={handleAdd}>Agregar</button>
//       <div>{message}</div>
//     </div>
//   );
// }