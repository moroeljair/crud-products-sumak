"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Product } from "@/types/Product";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .overrideTypes<Product[]>();

  if (error) throw error;

  return data;
}
