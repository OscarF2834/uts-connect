import React, { createContext, useContext, useState } from "react";
import { getUser } from "../lib/auth";

export type CartItem = {
  id: string;
  type: "producto" | "favor";
  title: string;
  price: number;
  cantidad?: number;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      // Si ya existe, suma cantidad
      const idx = prev.findIndex(i => i.id === item.id && i.type === item.type);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].cantidad = (updated[idx].cantidad || 1) + 1;
        return updated;
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, item) => acc + (item.price * (item.cantidad || 1)), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};
