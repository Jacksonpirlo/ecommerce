import axios from "axios"

export const cartService = async () => {
    const res = await axios.get("/api/cart");
    return res;
}

export const removeProductFromCart = async (userId: string, productId: string) => {
    const res = await axios.delete("/api/cart", {
    data: { 
      userId,
      productId 
    }
  })

  return res
}

export const clearCart = async (userId: string) => {
  const res = await axios.delete("/api/cart", {
    data: { userId }
  });
  return res;
};