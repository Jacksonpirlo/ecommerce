"use client"
import { PropductProps } from "@/dto/ProductProps";
import { getProducts } from "@/services/products";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const Products = () => {
const [products, setProducts] = useState<PropductProps[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data.products)
      console.log(data)
    }
    fetchProducts();
  }, [])
    return(
    <>
    <article className="flex flex-wrap justify-center items-center text-center">
      {products.map((product) => {
        return(
    <Card className="py-4 text-black" key={product._id}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={product.image}
          width={270}
          height={200}
        />
        <p className="text-tiny uppercase font-bold">{product.name}</p>
        <small className="text-default-500">{product.type}</small>
        <h4 className="font-bold text-large">{product.price}</h4>
        <h4 className="font-bold text-large">{product.description}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
      </CardBody>
        </Card>
      
        )
      })}
    </article>
    </>
 )
}

export default Products;