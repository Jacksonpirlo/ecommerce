import axios from "axios";
const API = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = async () => {
  const res = await axios.get(`${API}/api/dashboard/products`);
  return res.data;
};