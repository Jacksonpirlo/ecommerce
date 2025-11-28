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
        userId: user?.id, // <-- usa user.id aquí
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
          <Card className="py-4 text-black w-[320]" key={product._id}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <Image
                alt="Card background"
                className="object-cover rounded-xl mb-4"
                src={product.image}
                width={270}
                height={200}
              />
              <div className="flex flex-col items-start p-1">
                <p className="text-tiny uppercase font-bold">{product.name}</p>
                <small className="text-default-500">{product.type}</small>
                <h4 className="font-bold text-large">{product.price}$</h4>
                <p className="font-medium text-large text-start">{product.description}</p>
              </div>
            </CardHeader>
            <CardBody className="m-6 overflow-visible py-2">
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-green-400 text-white px-4 rounded cursor-pointer hover:bg-green-500 transition"
              >
                {t("agregar_carrito")}
              </button>
            </CardBody>
          </Card>
        ))}
      </article>
      {/* Controles de paginación */}
      <div className="flex justify-center items-center gap-2 my-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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