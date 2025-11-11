import { useEffect, useState } from "react";

const Products = () => {
const [products, setProducts] = useState<string[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
    }
    fetchProducts();
  }, [])
    return(
    <></>
 )
}

export default Products;