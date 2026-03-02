"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export type DeleteActionState = {
  success: boolean;
  message: string;
};

export async function deleteProduct(
  prevState: DeleteActionState,
  formData: FormData,
): Promise<DeleteActionState> {
  const supabase = await createSupabaseServerClient();

  const id = formData.get("id") as string;

  if (!id) {
    return { success: false, message: "Producto inválido" };
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { success: false, message: "Error al eliminar" };
  }

  revalidatePath("/dashboard");
  revalidatePath("/productos");

  return { success: true, message: "Producto eliminado" };
}
