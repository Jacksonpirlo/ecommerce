"use client"
import { PropductProps } from "@/dto/ProductProps";
import { getProducts } from "@/services/products";
import { Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import SearchBar from "../products/SearchBar";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<PropductProps[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(8); // Puedes ajustar el límite
  const [totalPages, setTotalPages] = useState(1);
  const { data: session } = useSession();
  const user = session?.user as { id?: string; name?: string; email?: string; image?: string };
  const fetchProducts = async (searchQuery = query, pageNumber = page) => {
    const data = await getProducts({ name: searchQuery, page: pageNumber, limit });
    setProducts(data.products);
    setTotalPages(data.pages || 1); // Usar 'pages' del backend
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [query, page]);

  // Handler para búsqueda
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1); // Reinicia a la primera página en cada búsqueda
  };

  // Handler para paginación
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleAddToCart = async (product: PropductProps) => {
    try {
      const res = await axios.post("/api/cart", {
        userId: user?.id,
        product: {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image
        }
      });
      if (res.data.ok) {
        toast.success("¡Producto agregado al carrito!");
      } else {
        toast.error("Error al agregar al carrito");
      }
    } catch (error) {
      toast.error("Error al agregar al carrito");
      console.error(error);
    }
  };

  return (
    <>
      <article className="flex flex-wrap justify-center items-center text-center">
        <SearchBar onSearch={handleSearch} />
        {products.map((product) => (
          <Card className="py-0 px-0 text-black w-[320px] shadow-2xl m-5 rounded-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300" key={product._id}>
            <CardHeader className="p-0 flex-col items-start">
              <Image
                alt={product.name}
                className="object-cover w-full"
                src={product.image}
                width={320}
                height={280}
              />
              <div className="flex flex-col items-start p-4 w-full gap-2">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">{product.name}</h3>
                {product.type && (
                  <span className="text-xs font-medium text-gray-500 uppercase">{product.type}</span>
                )}
                <h4 className="font-bold text-2xl text-green-600">${product.price}</h4>
                <p className="text-sm text-gray-600 text-start line-clamp-2 leading-relaxed">{product.description}</p>
              </div>
            </CardHeader>
            <CardBody className="flex justify-center items-center text-center overflow-visible py-3 px-4">
              <button
                onClick={() => handleAddToCart(product)}
                className="w-[80%] bg-green-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-600 transition-all mb-2 duration-200 shadow-md hover:shadow-lg"
              >
                {t("agregar_carrito")}
              </button>
            </CardBody>
          </Card>
        ))}
      </article>
      {/* Controles de paginación */}
      <div className="flex justify-center items-center gap-4 my-8">
        <button
          className="px-5 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span className="text-gray-700 font-medium">
          Página <span className="font-bold text-green-600">{page}</span> de <span className="font-bold">{totalPages}</span>
        </span>
        <button
          className="px-5 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Siguiente
        </button>
      </div>
    </>
  );
};

export default Products;