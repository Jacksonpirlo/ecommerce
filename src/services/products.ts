import axios from "axios";
const API = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = async (params?: { name?: string; page?: number; limit?: number }) => {
  let url = `${API}/api/dashboard/products`;
  if (params) {
    const query = new URLSearchParams();
    if (params.name) query.append("name", params.name);
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    url += `?${query.toString()}`;
  }
  const res = await axios.get(url);
  return res.data;
};