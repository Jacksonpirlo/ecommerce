import axios from "axios"
const API = ""
const getProducts = async () => {
    const res = axios.get(`${API}/products`);
}