"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/services/products/delete-product";
import { useToast } from "@/components/ui/ToastProvider";
import { MessageCircleWarning } from "lucide-react";

export default function ConfirmDeleteProduct({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", id);

      const result = await deleteProduct(
        { success: false, message: "" },
        formData,
      );

      if (result.success) {
        showToast(result.message, "success");
        onClose();
      } else {
        showToast(result.message, "error");
      }
    });
  }

  return (
    <div className="p-8 rounded-lg space-y-6">
      {/* Icono y título */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <MessageCircleWarning className="w-6 h-6 text-gray-900" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-400">
            ¿Eliminar producto?
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Esta acción eliminará el producto de forma permanente. No podrás
            recuperar esta información después.
          </p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={onClose}
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
        >
          Cancelar
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          {isPending ? (
            <span className="flex items-center gap-2">Eliminando...</span>
          ) : (
            "Sí, eliminar"
          )}
        </button>
      </div>
    </div>
  );
}
