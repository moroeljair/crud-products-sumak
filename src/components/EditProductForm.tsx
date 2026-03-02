"use client";

import { useTransition, useState } from "react";
import { updateProduct } from "@/services/products/update-product";
import { Product } from "@/types/Product";
import Popup from "./Popup";
import { useToast } from "@/components/ui/ToastProvider";

export default function EditProductForm({ product }: { product: Product }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar error previo

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProduct(formData);

      if (result.success) {
        showToast(result.message, "success");
        setIsEditing(false);
      } else {
        showToast(result.message, "error");
        setErrorMessage(result.message);
      }
    });
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-blue-400 text-sm border border-blue-600 px-2 rounded hover:bg-blue-600 hover:text-white transition-colors"
      >
        Editar
      </button>
    );
  }

  return (
    <Popup
      isOpen={isEditing}
      onClose={() => {
        setIsEditing(false);
        setErrorMessage("");
      }}
      backgroundStyleInto="bg-black/90"
    >
      <div className="p-8 rounded-lg space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <h3 className="text-xl font-bold text-gray-200 mb-4 ">
            Editar Producto
          </h3>

          <input type="hidden" name="id" value={product.id} />

          <input
            type="text"
            name="name"
            defaultValue={product.name}
            className="border p-1 rounded w-full text-gray-400"
          />

          <textarea
            name="description"
            placeholder="Descripción"
            rows={2}
            defaultValue={product.description || ""}
            className="border p-2 rounded w-full resize-none text-gray-400"
          />

          <input
            type="number"
            name="price"
            defaultValue={product.price}
            step="0.01"
            className="border p-1 rounded w-full text-gray-400"
          />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white px-4 rounded-lg disabled:opacity-50 hover:bg-blue-500 transition-colors
              x-5 py-2.5  font-semibold
              "
            >
              {isPending ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setErrorMessage("");
              }}
              className="text-gray-400 text-sm hover:text-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-600">{errorMessage}</p>
          )}
        </form>
      </div>
    </Popup>
  );
}
