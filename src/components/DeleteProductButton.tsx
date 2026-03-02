"use client";

import { useState } from "react";
import Popup from "@/components/Popup";
import ConfirmDeleteProduct from "./ConfirmeDeleteProduct";

export default function DeleteProductButton({ id }: { id: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-red-600 text-sm border border-red-600 px-2 rounded hover:bg-red-600 hover:text-white transition-colors"
      >
        Eliminar
      </button>

      <Popup
        isOpen={open}
        onClose={() => setOpen(false)}
        backgroundStyleInto="bg-black/90"
      >
        <ConfirmDeleteProduct id={id} onClose={() => setOpen(false)} />
      </Popup>
    </>
  );
}
