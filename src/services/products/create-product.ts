"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function createProduct(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price");

  if (!name || !price) {
    return { success: false, message: "El nombre y el precio son requeridos" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autorizado");
  }

  const { error } = await supabase.from("products").insert([
    {
      name,
      description,
      price: Number(price),
      user_id: user.id,
    },
  ]);

  if (error) {
    return { success: false, message: "Error al crear el producto" };
  }

  // refrescar la pagina que tiene productos
  revalidatePath("/dashboard");
  revalidatePath("/productos");

  return { success: true, message: "Producto creado exitosamente" };
}
