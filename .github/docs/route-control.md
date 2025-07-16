# Controle de Rotas e Permissões

## 🚨 CONTROLE DE ROTAS E PERMISSÕES - PRIORIDADE CRÍTICA

**OBRIGATÓRIO:** Toda rota do sistema deve estar configurada e autorizada através do sistema de controle de rotas.

### **Sistema de Route Control**

**📍 Localização:** `/src/config/route-control.ts`

**REGRA FUNDAMENTAL:** Para uma rota estar acessível, ela DEVE estar configurada no arquivo `route-control.ts` com as
permissões adequadas.

```typescript
// src/config/route-control.ts
import { UserRole } from "@prisma/client";

const allAllowed = [UserRole.MEMBER, UserRole.MANAGER, UserRole.ADMIN];

// Rotas públicas (não precisam de autenticação)
export const publicRoutes = ["/login", "/auth/verify-token", "/unauthorized", "/example"];

// Configuração de permissões por rota
export const routesPermissions = [
   {
      path: "/",
      rolesAllowed: allAllowed
   },
   {
      path: "/admin-page",
      rolesAllowed: [UserRole.ADMIN] // Apenas ADMIN pode acessar
   },
   {
      path: "/posts",
      rolesAllowed: allAllowed // Todos os roles podem acessar
   }
];
```

### **Processo Obrigatório para Novas Rotas**

1. **SEMPRE** consulte `.project-business-rules.md` para entender as regras de negócio específicas
2. **SEMPRE** adicione a nova rota em `route-control.ts` com os roles apropriados
3. **SEMPRE** verifique permissões no servidor (tRPC/Server Actions) usando o arquivo `permissions.ts`
4. **SEMPRE** implemente verificações de UI baseadas no role do usuário

### **Sistema de Permissões Granulares**

**📍 Localização:** `/src/common/permissions.ts`

```typescript
// Permissões disponíveis no sistema
export const Permissions = {
   CREATE: "CREATE",
   READ: "READ",
   UPDATE: "UPDATE",
   SOFT_DELETE: "SOFT_DELETE",
   HARD_DELETE: "HARD_DELETE",
   SOFT_DELETE_ALL: "SOFT_DELETE_ALL"
} as const;

// Mapeamento de roles para permissões
export const RolePermissions = {
   [UserRole.MEMBER]: [Permissions.READ, Permissions.CREATE],
   [UserRole.MANAGER]: [Permissions.READ, Permissions.CREATE, Permissions.UPDATE, Permissions.SOFT_DELETE],
   [UserRole.ADMIN]: [
      /* todas as permissões */
   ]
};

// Função helper para verificar permissões
export const checkPermission = (role: UserRole, permissions: IPermission[]): boolean => {
   const rolePermissions = RolePermissions[role];
   return permissions.some((permission) => rolePermissions.includes(permission));
};
```

### **Implementação de Verificações de Permissão**

#### **Server-side (tRPC Procedures):**

```typescript
import { checkPermission, Permissions } from "@/common/permissions";
import { TRPCError } from "@trpc/server";

export const exampleRouter = t.router({
   create: t.procedure.input(schema).mutation(async ({ input, ctx }) => {
      // 1. SEMPRE verificar autenticação
      if (!ctx.user) {
         throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // 2. SEMPRE verificar permissões específicas baseadas em .project-business-rules.md
      if (!checkPermission(ctx.user.role, [Permissions.CREATE])) {
         throw new TRPCError({
            code: "FORBIDDEN",
            message: "Permissão insuficiente para criar registro"
         });
      }

      // 3. Implementar lógica do negócio
      return await db.entity.create({ data: input });
   })
});
```

#### **Client-side (React Components):**

```typescript
"use client";
import { useSession } from "@/interface/hooks/useSession";
import { checkPermission, Permissions } from "@/common/permissions";

export function MyComponent() {
   const { user } = useSession();

   // Verificação baseada nas regras de negócio
   const canCreate = user && checkPermission(user.role, [Permissions.CREATE]);
   const canDelete = user && checkPermission(user.role, [Permissions.SOFT_DELETE]);

   return (
      <div>
         {canCreate && <Button>Criar Novo</Button>}
         {canDelete && <Button variant="destructive">Excluir</Button>}
      </div>
   );
}
```

### **Verificação em Middleware**

O sistema já possui um middleware configurado em `/src/middleware.ts` que verifica automaticamente as permissões das
rotas com base nas configurações do `route-control.ts`.

### **Casos Especiais de Permissão**

Para permissões mais complexas ou específicas por domínio, use verificações customizadas:

```typescript
// Exemplo: Verificação de dono do recurso
const isResourceOwner = await db.resource.findFirst({
   where: {
      id: input.resourceId,
      userId: ctx.user.id
   }
});

// Combinar com verificação de permissão
if (!isResourceOwner && !checkPermission(ctx.user.role, [Permissions.ADMIN_ACCESS])) {
   throw new TRPCError({
      code: "FORBIDDEN",
      message: "Acesso negado a este recurso"
   });
}
```
