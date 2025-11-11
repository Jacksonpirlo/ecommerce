import axios from "axios"
const API = ""
export const getProducts = async () => {
    const res = axios.get(`${API}/products`);
    return (await res).data;
}