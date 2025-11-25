import axios from "axios"
const API = process.env.NEXTAUTH_URL;
export const getProducts = async () => {
    const res = axios.get(`${API}/products`);
    return (await res).data;
}