import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { getProducts } from "@/services/products/get-products";
import CreateProductForm from "@/components/CreateProductForm";
import LogoutButton from "@/components/LogoutButton";
import EditProductForm from "@/components/EditProductForm";
import { Product } from "@/types/Product";
import DeleteProductButton from "@/components/DeleteProductButton";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const products: Product[] = await getProducts();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header sticky */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Primera fila: Info usuario */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
            </div>
            <LogoutButton />
          </div>

          {/* Segunda fila: Acciones */}
          <div className="flex items-center justify-between py-3">
            <h2 className="text-lg font-semibold text-gray-800">Productos</h2>
            <CreateProductForm />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-3">
          {products?.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">No hay productos aún.</p>
              <p className="text-gray-400 text-sm mt-2">
                Comienza creando tu primer producto
              </p>
            </div>
          )}

          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 p-5 rounded-xl flex justify-between items-start hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-900">
                  {product.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {product.description}
                </p>
                <p className="text-base font-semibold text-blue-600 mt-2">
                  ${product.price}
                </p>
              </div>
              <div className="flex gap-2 items-center ml-4">
                <EditProductForm product={product} />
                <DeleteProductButton id={product.id} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
