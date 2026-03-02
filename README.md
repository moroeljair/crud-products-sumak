# 📦 CRUD Productos - Sistema de Gestión

Sistema de gestión de productos construido con Next.js 15, React 19, TypeScript y Supabase.

## 🚀 Configuración y Ejecución

### Requisitos Previos

- Node.js 18+
- npm/yarn/pnpm
- Cuenta de Supabase

### Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd crud-products-sumak
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Ejecutar en desarrollo**

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout raíz
│   ├── page.tsx           # Página de login (/)
│   ├── dashboard/         # Área protegida
│   │   └── page.tsx       # Dashboard con productos
│   └── globals.css        # Estilos globales
│
├── components/            # Componentes React
│   ├── CreateProductForm.tsx    # Formulario crear
│   ├── EditProductForm.tsx      # Formulario editar
│   ├── DeleteProductButton.tsx  # Botón eliminar
│   ├── ConfirmeDeleteProduct.tsx # Modal confirmación
│   ├── LogoutButton.tsx         # Botón cerrar sesión
│   ├── Popup.tsx               # Modal reutilizable
│   └── ui/                     # Componentes UI
│       └── ToastProvider.tsx   # Sistema de notificaciones
│
├── lib/                   # Configuración de librerías
│   ├── supabase-client.ts # Cliente Supabase (CSR)
│   └── supabase-server.ts # Cliente Supabase (SSR)
│
├── services/              # Lógica de negocio
│   └── products/
│       ├── create-product.ts    # Crear producto
│       ├── update-product.ts    # Actualizar producto
│       ├── delete-product.ts    # Eliminar producto
│       └── get-products.ts      # Obtener productos
│
└── types/                 # Definiciones TypeScript
    └── Product.ts         # Tipo Product
```

### Explicación de Carpetas

- **`app/`**: Rutas y páginas usando Next.js App Router
- **`components/`**: Componentes reutilizables de la UI
- **`lib/`**: Configuración de servicios externos (Supabase)
- **`services/`**: Server Actions y lógica de negocio
- **`types/`**: Definiciones de tipos TypeScript

## 🔐 Autenticación con Supabase

### Flujo de Autenticación

1. **Login (`/`)**: Los usuarios ingresan email y contraseña
2. **Verificación**: Supabase valida las credenciales
3. **Sesión**: Se crea una sesión persistente
4. **Protección**: Dashboard verifica la sesión en el servidor

### Implementación

**Client-Side (Login)**

```typescript
// src/lib/supabase-client.ts
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

**Server-Side (Dashboard)**

```typescript
// src/lib/supabase-server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Valida sesión en el servidor
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) redirect("/");
```

## ⚡ Uso de Next.js

### Server-Side Rendering (SSR)

**Dashboard (`/dashboard/page.tsx`)**

- Componente `async` de servidor
- Valida autenticación en el servidor
- Carga productos antes de renderizar
- Mejor SEO y seguridad

```typescript
export default async function DashboardPage() {
  const user = await validateUser()     // SSR
  const products = await getProducts()   // SSR
  return <div>...</div>
}
```

### Client-Side Rendering (CSR)

**Login (`/page.tsx`)**

- Componente cliente (`"use client"`)
- Manejo de estado con `useState`
- Interacciones del usuario
- Redirección después del login

```typescript
"use client";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  // Lógica interactiva
}
```

### Server Actions

**Operaciones CRUD**

- Funciones que se ejecutan en el servidor
- Usadas con `useTransition` para UX fluida
- Validan y mutean datos de forma segura

```typescript
export async function createProduct(formData: FormData) {
  "use server"  // Server Action
  const { data, error } = await supabase
    .from('products')
    .insert(...)
  return { success: !error, message: "..." }
}
```

## 🧹 Código Limpio

### Principios Aplicados

1. **Separación de responsabilidades**
   - Componentes UI separados de lógica de negocio
   - Services manejan operaciones de base de datos
   - Types centralizan definiciones

2. **Componentes pequeños y enfocados**
   - Cada componente tiene una responsabilidad única
   - Reutilización mediante props tipadas

3. **TypeScript estricto**
   - Tipado completo en toda la aplicación
   - Interfaces claras para props y datos

4. **Nomenclatura consistente**
   - Componentes: PascalCase
   - Funciones: camelCase
   - Constantes: UPPER_SNAKE_CASE

## 🏗️ Organización de Componentes

### Patrón de Composición

**Formularios**

- `CreateProductForm`: Modal para crear
- `EditProductForm`: Modal para editar con datos precargados
- Ambos usan `useTransition` para feedback

**Acciones**

- `DeleteProductButton`: Trigger del modal
- `ConfirmeDeleteProduct`: Modal de confirmación
- Separación de concerns

**UI Compartida**

- `Popup`: Modal reutilizable con portal
- `ToastProvider`: Sistema global de notificaciones

### Páginas

```
/                   → Login (CSR)
/dashboard          → Lista de productos (SSR)
```

## 🔧 Integración con Supabase

### Configuración

# 🗄️ Backend con Supabase

Este proyecto utiliza **Supabase** como backend para:

- **Backend**: Supabase (PostgreSQL + Auth + RLS)

- Autenticación de usuarios
- Base de datos PostgreSQL
- Row Level Security (RLS)
- Relación entre productos y el usuario creador

---

## 📦 Tabla `products`

Se creó la tabla `products` con la siguiente estructura:

### 🧠 Explicación de los campos

| Campo       | Descripción                                |
| ----------- | ------------------------------------------ |
| id          | Identificador único del producto           |
| name        | Nombre del producto                        |
| description | Descripción opcional del producto          |
| price       | Precio del producto                        |
| user_id     | Usuario que creó el producto               |
| created_at  | Fecha de creación generada automáticamente |

```
create table public.products (
  id uuid not null default gen_random_uuid (),
  name text not null,
  description text null,
  price numeric(10, 2) not null,
  created_at timestamp without time zone null default now(),
  user_id uuid null default auth.uid (),
  constraint products_pkey primary key (id)
) TABLESPACE pg_default;
```

---

## 🔐 Row Level Security (RLS)

Se activó **Row Level Security (RLS)** para proteger los datos.

### 📜 Políticas configuradas

Se configuraron políticas para permitir que únicamente los usuarios autenticados puedan realizar operaciones **CRUD** en la tabla `products`.

```
alter policy "Only authenticated users can manage products"

on "public"."products"

to public

using (
(auth.role() = 'authenticated'::text)

) with check (
 (auth.role() = 'authenticated'::text)

);
```

---

## 🔒 Seguridad actual

- Solo los usuarios autenticados pueden acceder al CRUD.
- Cada producto queda vinculado a su creador.
- RLS protege el acceso directamente desde la base de datos.
- No se exponen datos sin autenticación.

### Operaciones

- **Auth**: `supabase.auth.signInWithPassword()`, `getUser()`, `signOut()`
- **CRUD**: `from('products').select()`, `.insert()`, `.update()`, `.delete()`

## 🎨 Características

- ✅ Autenticación con Supabase
- ✅ CRUD completo de productos
- ✅ UI moderna con Tailwind CSS
- ✅ Notificaciones toast animadas
- ✅ Modales reutilizables
- ✅ Validación de formularios
- ✅ Estados de carga
- ✅ Manejo de errores
- ✅ Responsive design
- ✅ TypeScript estricto

## 📦 Tecnologías

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS
- **Animaciones**: Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Lenguaje**: TypeScript
- **Autenticación**: Supabase Auth

---

Desarrollado con Next.js y Supabase
