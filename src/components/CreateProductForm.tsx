"use client";

import { useTransition, useState } from "react";
import { createProduct } from "@/services/products/create-product";
import Popup from "./Popup";
import { useToast } from "@/components/ui/ToastProvider";

export default function CreateProductForm() {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar error previo

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createProduct(formData);

      if (result.success) {
        showToast(result.message, "success");
        setShowForm(false);
      } else {
        showToast(result.message, "error");
        setErrorMessage(result.message);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-500 transition-colors"
      >
        {showForm ? "Ocultar Formulario" : "Crear Nuevo Producto"}
      </button>

      <Popup
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setErrorMessage("");
        }}
        backgroundStyleInto="bg-black/90"
      >
        <div className="p-8 rounded-lg space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <h3 className="text-xl font-bold text-gray-200 mb-4">
              Crear Nuevo Producto
            </h3>

            <input
              type="text"
              name="name"
              placeholder="Nombre"
              required
              className="border p-2 rounded w-full text-gray-400"
            />

            <textarea
              name="description"
              placeholder="Descripción"
              rows={2}
              className="border p-2 rounded w-full resize-none text-gray-400"
            />

            <input
              type="number"
              name="price"
              placeholder="Precio"
              required
              min="0"
              step="0.01"
              className="border p-2 rounded w-full text-gray-400"
            />

            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-blue-500 transition-colors"
            >
              {isPending ? "Creando..." : "Crear Producto"}
            </button>

            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </form>
        </div>
      </Popup>
    </>
  );
}
