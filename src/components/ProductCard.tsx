import React from "react";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export type Product = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  image?: string;
  author?: string;
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addItem } = useCart();
  const handleSeleccionar = async () => {
    addItem({
      id: product.id,
      type: "producto",
      title: product.title,
      price: product.price || 0,
    });
    // Reducir stock en la base de datos
    await api.put(`/productos/${product.id}/reducir-stock`, { cantidad: 1 });
  };

  return (
    <article className="bg-white rounded-lg shadow p-4 flex flex-col">
      <img
        src={product.image ?? "/placeholder.png"}
        alt={product.title}
        className="h-40 w-full object-cover rounded"
      />
      <h3 className="mt-3 font-semibold text-gray-800">{product.title}</h3>
      <p className="text-sm text-gray-600 mt-1 line-clamp-3">
        {product.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="text-lg font-bold text-indigo-600">
          {product.price != null ? `$${product.price}` : "Gratis"}
        </span>
        <button
          className="text-sm bg-green-600 text-white px-3 py-1 rounded"
          onClick={handleSeleccionar}
        >
          Seleccionar
        </button>
      </div>
      {/* Marca de agua con el nombre del dueño */}
      <div className="text-xs text-gray-400 text-right mt-2 opacity-80 select-none">
        @{product.author}
      </div>
    </article>
  );
};

export default ProductCard;
