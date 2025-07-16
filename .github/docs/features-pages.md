# Features e Páginas

## 📱 Organização por Domínio

### **Princípios de Organização**

O projeto adota uma estrutura de organização **feature-first**, onde o código é organizado primariamente por domínio
funcional, não por tipo de tecnologia. Isso promove coesão e facilita a manutenção.

### **Estrutura de Features**

```
src/
├── interface/
│   ├── features/           # Código frontend organizado por domínio
│   │   ├── auth/           # Feature de autenticação
│   │   │   ├── components/ # Componentes específicos da feature
│   │   │   │   ├── login-form.tsx
│   │   │   │   └── signup-form.tsx
│   │   │   ├── hooks/      # Hooks específicos da feature
│   │   │   │   └── useAuth.ts
│   │   │   └── index.tsx   # Componente principal da feature
│   │   │
│   │   ├── dashboard/      # Feature de dashboard
│   │   │   ├── components/
│   │   │   │   ├── stats-card.tsx
│   │   │   │   └── activity-feed.tsx
│   │   │   └── index.tsx
│   │   │
│   │   └── [domain-name]/  # Outras features por domínio
│   │       ├── components/ # Componentes específicos da feature
│   │       ├── hooks/      # Hooks específicos da feature
│   │       └── index.tsx   # Exporta componente principal
```

### **Estrutura de Páginas (App Router)**

As páginas do Next.js seguem a estrutura de pastas do App Router:

```
app/
├── layout.tsx          # Layout raiz
├── (protected)/        # Route group para rotas protegidas
│   ├── layout.tsx      # Layout compartilhado para rotas protegidas
│   ├── page.tsx        # Página inicial (/)
│   └── [domain]/       # Páginas por domínio
│       └── page.tsx
├── api/                # Rotas de API
│   ├── auth/           # Endpoints de autenticação
│   └── trpc/           # Endpoints tRPC
│       └── [trpc]/
└── login/              # Rotas públicas
    └── page.tsx
```

### **Uso de Route Groups**

O projeto utiliza route groups para agrupar rotas com características semelhantes:

- **(protected)/** - Rotas que exigem autenticação
- **(public)/** - Rotas públicas, sem autenticação
- **(admin)/** - Rotas que exigem permissões de administrador

### **Criação de Novas Features**

#### **1. Estrutura da Feature**

Ao criar uma nova feature, siga a seguinte estrutura:

```typescript
// src/interface/features/[feature-name]/index.tsx

"use client";
import { useSession } from "@/interface/hooks/useSession";
import { useState } from "react";
import { api } from "@/config/trpc/react";
import { FeatureComponent } from "./components/feature-component";

export function FeatureName() {
   const { user } = useSession();
   const { data, isLoading } = api.[domain].[method].useQuery();

   return (
      <div className="container mx-auto py-6">
         <h1 className="text-2xl font-bold mb-4">Feature Title</h1>

         {/* Conteúdo principal da feature */}
         <FeatureComponent data={data} isLoading={isLoading} user={user} />
      </div>
   );
}
```

#### **2. Componentes da Feature**

Componentes específicos da feature devem ser organizados em uma pasta `components`:

```typescript
// src/interface/features/[feature-name]/components/feature-component.tsx

"use client";
import { Button } from "@/interface/components/ui/button";

type FeatureComponentProps = {
   data: any;
   isLoading: boolean;
   user: User | null;
};

export function FeatureComponent({ data, isLoading, user }: FeatureComponentProps) {
   if (isLoading) {
      return <div>Carregando...</div>;
   }

   return (
      <div>
         {/* Implementação do componente */}
      </div>
   );
}
```

#### **3. Hooks Específicos da Feature**

Se a feature precisar de lógica específica, crie hooks dedicados:

```typescript
// src/interface/features/[feature-name]/hooks/useFeatureLogic.ts

"use client";
import { useState, useCallback } from "react";
import { api } from "@/config/trpc/react";

export function useFeatureLogic() {
   const [state, setState] = useState(initialState);

   const { mutate, isLoading } = api.[domain].[action].useMutation({
      onSuccess: (data) => {
         // Lógica de sucesso
      },
      onError: (error) => {
         // Tratamento de erro
      }
   });

   const handleAction = useCallback(() => {
      mutate(params);
   }, [mutate, state]);

   return {
      state,
      isLoading,
      handleAction
   };
}
```

### **Criação de Novas Páginas**

Para adicionar uma nova página à aplicação:

#### **1. Criar Arquivo Page**

```typescript
// src/app/(protected)/[domain]/page.tsx

import { FeatureName } from "@/interface/features/[feature-name]";

export default function DomainPage() {
   return <FeatureName />;
}
```

#### **2. Configurar Rota**

**CRÍTICO:** Sempre configure a rota em `route-control.ts` antes de criar a página:

```typescript
// src/config/route-control.ts
import { UserRole } from "@prisma/client";

export const routesPermissions = [
   // ... rotas existentes
   {
      path: "/new-feature",
      rolesAllowed: [UserRole.ADMIN, UserRole.MANAGER] // Exemplo: apenas admin e manager
   }
];
```

#### **3. Layouts Específicos (Opcional)**

Se necessário, crie layouts específicos para seções da aplicação:

```typescript
// src/app/(protected)/[domain]/layout.tsx

import { Suspense } from "react";
import Loading from "./loading";

export default function DomainLayout({
   children
}: {
   children: React.ReactNode;
}) {
   return (
      <div className="domain-layout">
         {/* Layout específico do domínio */}
         <div className="domain-sidebar">
            {/* Navegação específica */}
         </div>

         <div className="domain-content">
            <Suspense fallback={<Loading />}>
               {children}
            </Suspense>
         </div>
      </div>
   );
}
```

### **Padrões para Páginas Dinâmicas**

Para rotas com parâmetros dinâmicos:

```typescript
// src/app/(protected)/[domain]/[id]/page.tsx

import { notFound } from "next/navigation";
import { apiServer } from "@/config/trpc/server";

export default async function DomainDetailPage({
   params
}: {
   params: { id: string };
}) {
   // Obter dados do servidor
   const entity = await apiServer.[domain].getById.query({ id: params.id })
      .catch(() => null);

   // Se não encontrar a entidade, mostrar 404
   if (!entity) {
      notFound();
   }

   return (
      <div>
         <h1>{entity.title}</h1>
         {/* Renderizar detalhes */}
      </div>
   );
}
```

### **Loading States**

Utilize o padrão do Next.js para estados de carregamento:

```typescript
// src/app/(protected)/[domain]/loading.tsx

export default function Loading() {
   return (
      <div className="flex justify-center items-center min-h-[400px]">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
   );
}
```

### **Error Handling**

Crie páginas de erro específicas:

```typescript
// src/app/(protected)/[domain]/error.tsx

"use client";
import { Button } from "@/interface/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
   error,
   reset
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) {
   useEffect(() => {
      // Opcionalmente log do erro para um serviço de monitoramento
      console.error(error);
   }, [error]);

   return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
         <h2 className="text-xl font-semibold mb-4">Algo deu errado!</h2>
         <p className="text-gray-600 mb-6">
            {error.message || "Ocorreu um erro ao carregar esta página."}
         </p>
         <Button onClick={reset}>Tentar novamente</Button>
      </div>
   );
}
```

### **Integração com tRPC**

#### **Server Components**

```typescript
// src/app/(protected)/[domain]/page.tsx

import { apiServer } from "@/config/trpc/server";

export default async function DomainPage() {
   const data = await apiServer.[domain].list.query();

   return (
      <div>
         {/* Renderizar dados */}
         {data.map(item => (
            <div key={item.id}>{item.title}</div>
         ))}
      </div>
   );
}
```

#### **Client Components**

```typescript
// src/interface/features/[feature-name]/components/data-list.tsx

"use client";
import { api } from "@/config/trpc/react";
import { useEffect } from "react";

export function DataList() {
   const { data, isLoading, error } = api.[domain].list.useQuery();

   useEffect(() => {
      if (error) {
         // Tratamento de erro
      }
   }, [error]);

   if (isLoading) {
      return <div>Carregando...</div>;
   }

   return (
      <div>
         {data?.map(item => (
            <div key={item.id}>{item.title}</div>
         ))}
      </div>
   );
}
```

### **Boas Práticas**

1. **SEMPRE** utilize a estrutura feature-first para organizar o código
2. **SEMPRE** configure permissões de rota em `route-control.ts` antes de criar páginas
3. **SEMPRE** implemente verificações de permissão tanto no servidor quanto no cliente
4. **SEMPRE** utilize Server Components para dados iniciais estáticos ou críticos para SEO
5. **SEMPRE** utilize Client Components para elementos interativos
6. **NUNCA** misture lógica de servidor em Client Components
7. **SEMPRE** mantenha coerência na nomenclatura:
   - Features e componentes: PascalCase
   - Hooks: camelCase com prefixo "use"
   - Arquivos: kebab-case ou camelCase (conforme padrão da pasta)
8. **SEMPRE** implemente estados de loading e tratamento de erros adequados
9. **SEMPRE** reutilize componentes UI da pasta `ui/` em vez de criar novos
