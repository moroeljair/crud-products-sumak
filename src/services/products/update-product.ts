"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function updateProduct(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));

  if (!id || !name || !price) {
    return { success: false, message: "Datos inválidos" };
  }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
    })
    .eq("id", id);

  if (error) {
    return { success: false, message: "Error al actualizar" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/productos");

  return { success: true, message: "Producto actualizado" };
}
