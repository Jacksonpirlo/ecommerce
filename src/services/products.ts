import axios from "axios"
const API = "http://localhost:3000/api/dashboard"
export const getProducts = async () => {
    const res = axios.get(`${API}/products`);
    return (await res).data;
}