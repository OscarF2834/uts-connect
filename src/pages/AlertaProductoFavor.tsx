import React from "react";

const AlertaProductoFavor: React.FC<{ onContinue: () => void; onCancel: () => void; }> = ({ onContinue, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-2">¿Producto o favor?</h2>
      <p className="mb-4 text-gray-700">
        Un <b>producto</b> es un bien físico que puedes vender, como helados, empanadas, figuras en crochet, etc.<br/>
        Un <b>favor</b> es un servicio, como hacer tareas, comprar hojas de examen, etc.<br/>
        Si tienes un emprendimiento, la categoría del producto se tomará de tu emprendimiento.<br/>
        Si no tienes emprendimiento, puedes registrar uno o continuar como vendedor de favores/productos.
      </p>
      <div className="flex gap-4 justify-end">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={onContinue}>Continuar</button>
        <button className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  </div>
);

export default AlertaProductoFavor;
