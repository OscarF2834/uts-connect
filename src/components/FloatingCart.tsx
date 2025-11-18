import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

const FloatingCart: React.FC = () => {
  const { items, total, removeItem } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full shadow-lg p-4 z-50 flex items-center"
        onClick={() => setOpen((o) => !o)}
        title="Ver carrito"
      >
        <ShoppingCart className="w-6 h-6" />
        {items.length > 0 && (
          <span className="ml-2 bg-white text-indigo-600 rounded-full px-2 text-xs font-bold">{items.length}</span>
        )}
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-xl p-4 z-50">
          <h3 className="text-lg font-bold mb-2">Carrito de compras</h3>
          {items.length === 0 ? (
            <div className="text-gray-500">No hay productos seleccionados.</div>
          ) : (
            <ul className="mb-4">
              {items.map((item) => (
                <li key={item.id + item.type} className="flex justify-between items-center py-2 border-b">
                  <span>{item.title} <span className="text-xs text-gray-400">x{item.cantidad}</span></span>
                  <span className="font-bold">${item.price * (item.cantidad || 1)}</span>
                  <button className="ml-2 text-red-500" onClick={() => removeItem(item.id)}>Quitar</button>
                </li>
              ))}
            </ul>
          )}
          <div className="font-bold text-right text-indigo-600 text-lg">Total: ${total}</div>
        </div>
      )}
    </div>
  );
};

export default FloatingCart;
