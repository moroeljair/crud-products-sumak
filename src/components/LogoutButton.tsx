"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg bg-red-600 text-white px-4 py-2 hover:bg-red-500 transition-colors"
    >
      Cerrar Sesión
    </button>
  );
}
