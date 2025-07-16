# Regras de Negócio

## 📝 Consulta e Implementação de Regras de Negócio

### **Visão Geral**

O arquivo `.project-business-rules.md` na raiz do projeto contém todas as regras de negócio específicas da aplicação.
Este documento é a fonte de verdade para a lógica de negócios e deve ser consultado antes de implementar qualquer
funcionalidade.

### **Importância das Regras de Negócio**

As regras de negócio definem o comportamento esperado da aplicação e servem como contrato entre desenvolvedores,
stakeholders e usuários. Elas garantem que todas as funcionalidades sigam os mesmos padrões e comportamentos definidos
para o projeto.

### **Procedimento Obrigatório**

**ANTES** de implementar qualquer funcionalidade, **SEMPRE**:

1. Consulte o arquivo `.project-business-rules.md`
2. Identifique todas as regras relevantes para a funcionalidade em questão
3. Esclareça qualquer dúvida sobre as regras com o usuário antes de começar o desenvolvimento
4. Implemente rigorosamente seguindo as regras definidas
5. Valide a implementação contra as regras antes de finalizar

### **Exemplo de Consulta**

```typescript
// Exemplo: Antes de implementar a funcionalidade de "criação de posts"
// 1. Consultar .project-business-rules.md para regras específicas sobre posts:
//    - Quais roles podem criar posts?
//    - Existem limites de tamanho para títulos ou conteúdo?
//    - Quais validações específicas são necessárias?
//    - Quais são os estados possíveis de um post?
// 2. Implementar conforme as regras encontradas
```

### **Estrutura Típica de Regras de Negócio**

O arquivo `.project-business-rules.md` geralmente contém seções para diferentes domínios do sistema:

```markdown
# Regras de Negócio do Projeto

## 1. Autenticação e Autorização

- Regras para criação de contas
- Políticas de senha
- Comportamento de sessões
- Permissões por role

## 2. Gerenciamento de Usuários

- Estados possíveis de usuários
- Regras para atualização de perfil
- Requisitos para alteração de email/senha
- Comportamento de remoção de conta

## 3. [Domínio Específico]

- Regras para criação
- Validações obrigatórias
- Fluxos de aprovação
- Estados e transições permitidas
```

### **Implementação de Regras**

#### **Exemplo: Implementação de Regras de Validação**

```typescript
// 1. Consultar regras no .project-business-rules.md
// Regra encontrada: "Títulos de posts devem ter entre 5 e 100 caracteres"

// 2. Implementar a regra no schema Zod
// src/common/schemas/post.ts
import { z } from "@/config/zod-config";

export const postSchema = z.object({
   title: z
      .string()
      .min(5, "O título deve ter pelo menos 5 caracteres")
      .max(100, "O título não pode exceder 100 caracteres"),
   content: z.string().min(10, "O conteúdo deve ter pelo menos 10 caracteres")
   // Outros campos conforme as regras...
});
```

#### **Exemplo: Implementação de Regras de Autorização**

```typescript
// 1. Consultar regras no .project-business-rules.md
// Regra encontrada: "Apenas usuários ADMIN e MANAGER podem excluir posts"

// 2. Implementar a regra no router tRPC
// src/server/routers/post/methods/delete-post.ts
import { z } from "zod";
import { checkPermission, Permissions } from "@/common/permissions";
import { procedures } from "@/server/config/trpc";
import { TRPCError } from "@trpc/server";

export const deletePost = procedures.protected.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
   const { id } = input;
   const { session } = ctx;

   // Verificar se o usuário tem permissão de exclusão conforme regra de negócio
   if (!checkPermission(session.user.role, [Permissions.SOFT_DELETE])) {
      throw new TRPCError({
         code: "FORBIDDEN",
         message: "Você não tem permissão para excluir posts"
      });
   }

   // Implementar a exclusão
   return await postRepository.softDelete(id);
});
```

#### **Exemplo: Implementação de Regras de Fluxo de Trabalho**

```typescript
// 1. Consultar regras no .project-business-rules.md
// Regra encontrada: "Posts precisam ser aprovados por um MANAGER antes de publicação"

// 2. Implementar a regra no repository
// src/server/routers/post/repository.ts
import { db } from "@/server/config/prisma";
import { PostStatus, UserRole } from "@prisma/client";

export const postRepository = {
   // ... outros métodos

   publish: async (postId: string, userId: string, userRole: UserRole) => {
      // Verificar se o post existe
      const post = await db.post.findUnique({ where: { id: postId } });

      if (!post) {
         throw new Error("Post não encontrado");
      }

      // Implementar regra de negócio: apenas MANAGER pode publicar diretamente
      if (userRole === UserRole.MANAGER || userRole === UserRole.ADMIN) {
         return await db.post.update({
            where: { id: postId },
            data: { status: PostStatus.PUBLISHED }
         });
      } else {
         // Para outros roles, enviar para aprovação conforme regra de negócio
         return await db.post.update({
            where: { id: postId },
            data: { status: PostStatus.PENDING_APPROVAL }
         });
      }
   }
};
```

#### **Exemplo: Implementação de Regras de UI com Base no Role**

```typescript
// 1. Consultar regras no .project-business-rules.md
// Regra encontrada: "Apenas ADMIN vê o botão de exclusão permanente"

// 2. Implementar na interface
// src/interface/features/posts/components/post-actions.tsx
"use client";
import { Button } from "@/interface/components/ui/button";
import { useSession } from "@/interface/hooks/useSession";
import { UserRole } from "@prisma/client";

export function PostActions({ postId }: { postId: string }) {
  const { user } = useSession();

  // Verificar role do usuário conforme regra de negócio
  const isAdmin = user?.role === UserRole.ADMIN;
  const isManagerOrAdmin = user?.role === UserRole.MANAGER || user?.role === UserRole.ADMIN;

  return (
    <div className="space-x-2">
      {/* Botões visíveis conforme regras de negócio */}
      <Button variant="outline">Editar</Button>

      {isManagerOrAdmin && (
        <Button variant="destructive">Arquivar</Button>
      )}

      {isAdmin && (
        <Button variant="destructive">Excluir Permanentemente</Button>
      )}
    </div>
  );
}
```

### **Ciclo de Implementação**

1. **Consulta**: Ler `.project-business-rules.md` para entender as regras aplicáveis
2. **Esclarecer dúvidas**: Se necessário, pergunte ao usuário antes de implementar
3. **Implementação**:
   - Schemas Zod para validação
   - Verificações de autorização nos routers tRPC
   - Lógica condicional baseada em regras
   - UI adaptativa baseada em permissões
4. **Validação**: Verificar se a implementação está em conformidade com as regras
5. **Documentação**: Comentar código complexo relacionado a regras de negócio específicas

### **Boas Práticas**

1. **NUNCA** faça suposições sobre regras de negócio sem verificar o documento
2. **SEMPRE** documente decisões de implementação relacionadas a regras de negócio não claras
3. **SEMPRE** implemente validações tanto no cliente quanto no servidor
4. **SEMPRE** verifique permissões em cada camada (UI, API, banco de dados)
5. **SEMPRE** mantenha consistência nas mensagens de erro relacionadas a regras de negócio
6. **SEMPRE** escreva testes que validem o cumprimento das regras de negócio
7. **SEMPRE** pergunte ao usuário caso uma regra de negócio esteja ausente ou não clara

### **Resolução de Conflitos**

Se você encontrar regras de negócio conflitantes ou ambíguas:

1. Documente o conflito ou ambiguidade específica
2. Apresente ao usuário as diferentes interpretações possíveis
3. Peça esclarecimento antes de prosseguir com a implementação
4. Documente a decisão final para referência futura
