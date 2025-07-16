# Sistema de Autenticação

## 🔒 Providers e Fluxos de Autenticação

### **Arquitetura do Sistema de Autenticação**

O sistema de autenticação é modular e suporta múltiplos providers. Está localizado em `/src/server/auth/` e integrado no
middleware da aplicação.

### **Estrutura de Arquivos**

```
server/
├── auth/
│   ├── providers/            # Implementação dos providers
│   │   ├── github.ts         # Provider GitHub
│   │   ├── google.ts         # Provider Google
│   │   ├── magic-link.ts     # Provider Email Magic Link
│   │   └── credentials.ts    # Provider Credentials
│   ├── manager.ts            # Gerenciamento central de autenticação
│   ├── create-verification-code.ts # Código para magic links
│   ├── csrf-protection.ts    # Proteção CSRF
│   ├── rate-limit.ts         # Limitação de requisições
│   ├── security-headers.ts   # Headers de segurança
│   └── utils.ts              # Utilitários de autenticação
```

### **Providers de Autenticação Disponíveis**

O sistema suporta os seguintes métodos de autenticação:

1. **OAuth (Google, GitHub)**
2. **Magic Link por Email**
3. **Credenciais (Email/Senha)**

### **Fluxo de Autenticação**

#### **Autenticação OAuth (Google, GitHub)**

```typescript
// src/server/auth/providers/github.ts
export const githubAuthProvider: AuthProvider = {
   type: "oauth",
   id: "github",
   name: "GitHub",
   clientId: env.GITHUB_CLIENT_ID,
   clientSecret: env.GITHUB_CLIENT_SECRET,
   authorizationUrl: "https://github.com/login/oauth/authorize",
   tokenUrl: "https://github.com/login/oauth/access_token",
   userInfoUrl: "https://api.github.com/user",
   redirectUrl: `${env.APP_URL}/api/auth/callback/github`

   // ... configurações adicionais e manipuladores de eventos
};
```

#### **Magic Link por Email**

```typescript
// src/server/auth/providers/magic-link.ts
export const magicLinkProvider: AuthProvider = {
   type: "magic-link",
   id: "magic-link",
   name: "Email",

   // Função para criar e enviar email com link mágico
   sendVerificationEmail: async (email, code) => {
      // Envio de email implementado com Nodemailer + React Email
      await sendEmail({
         to: email,
         subject: "Link de acesso ao sistema",
         react: (
            <EmailTemplate
               code={code}
               redirectUrl={`${env.APP_URL}/api/auth/verify-token?code=${code}`}
            />
         )
      });
   },

   // Função para validar o código recebido
   validateVerificationCode: async (code) => {
      // Validação do código e obtenção de dados do usuário
   }
};
```

#### **Credenciais (Email/Senha)**

```typescript
// src/server/auth/providers/credentials.ts
export const credentialsProvider: AuthProvider = {
   type: "credentials",
   id: "credentials",
   name: "Email e Senha",

   // Validação de credenciais
   authorize: async (credentials) => {
      const { email, password } = credentials;

      // Obter usuário do banco
      const user = await db.user.findUnique({ where: { email } });

      // Validar senha com bcrypt ou similar
      const isValidPassword = user && (await bcrypt.compare(password, user.password));

      if (isValidPassword) {
         return { id: user.id, email: user.email, role: user.role };
      }

      return null;
   }
};
```

### **Gerenciamento de Sessão**

```typescript
// src/server/auth/manager.ts
export const authManager = {
   createSession: async (userId: string) => {
      const sessionToken = generateSecureToken();

      // Criar sessão no banco
      await db.session.create({
         data: {
            sessionToken,
            userId,
            expires: new Date(Date.now() + SESSION_MAX_AGE)
         }
      });

      return sessionToken;
   },

   getSession: async (sessionToken: string) => {
      // Obter sessão do banco
      const session = await db.session.findUnique({
         where: { sessionToken },
         include: { user: true }
      });

      // Verificar se a sessão é válida e não expirou
      if (!session || session.expires < new Date()) {
         return null;
      }

      return {
         id: session.id,
         user: session.user,
         expires: session.expires
      };
   }

   // ... outros métodos de gerenciamento de sessão
};
```

### **Uso no Frontend**

#### **Hook useSession**

```typescript
// src/interface/hooks/useSession.ts
"use client";

import { useEffect, useState } from "react";
import { api } from "@/config/trpc/react";

export function useSession() {
   const [isLoading, setIsLoading] = useState(true);
   const [user, setUser] = useState<User | null>(null);

   // Obter sessão atual
   const { data, isLoading: isFetching } = api.auth.getSession.useQuery(undefined, {
      refetchOnWindowFocus: false,
      retry: false
   });

   useEffect(() => {
      if (!isFetching) {
         setUser(data?.user || null);
         setIsLoading(false);
      }
   }, [data, isFetching]);

   return {
      user,
      isLoading,
      isAuthenticated: !!user
   };
}
```

#### **AuthProvider (Server Component)**

```typescript
// src/interface/components/auth-provider.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";

export default async function AuthProvider({
   children,
   requiredRole,
}: {
   children: React.ReactNode;
   requiredRole?: UserRole;
}) {
   const cookieStore = cookies();
   const sessionToken = cookieStore.get("session-token")?.value;

   // Se não houver token, redirecionar para login
   if (!sessionToken) {
      redirect("/login");
   }

   // Obter sessão a partir do token
   const session = await getSession(sessionToken);

   // Se não houver sessão ou o usuário não tiver permissão
   if (!session || (requiredRole && session.user.role !== requiredRole)) {
      redirect("/unauthorized");
   }

   return <>{children}</>;
}
```

### **Middleware de Autenticação**

O middleware de autenticação está configurado em `/src/middleware.ts` e verifica automaticamente todas as rotas,
comparando com as configurações em `route-control.ts`.

```typescript
// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/common/auth-edge";
import { publicRoutes, routesPermissions } from "@/config/route-control";

export async function middleware(request: NextRequest) {
   const { pathname } = request.nextUrl;

   // Rotas públicas não precisam de autenticação
   if (publicRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
   }

   // Obter sessão a partir do cookie
   const sessionToken = request.cookies.get("session-token")?.value;
   const session = sessionToken ? await getSession(sessionToken) : null;

   // Se não houver sessão, redirecionar para login
   if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
   }

   // Verificar permissões da rota
   const routeConfig = routesPermissions.find((route) => pathname.startsWith(route.path));

   // Se a rota precisar de permissões específicas
   if (routeConfig && !routeConfig.rolesAllowed.includes(session.user.role)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
   }

   return NextResponse.next();
}

export const config = {
   matcher: ["/((?!api/auth|_next/static|favicon.ico).*)"]
};
```

### **Proteções de Segurança**

#### **CSRF Protection**

```typescript
// src/server/auth/csrf-protection.ts
export const csrfProtection = {
   generateToken: () => {
      // Gerar token CSRF
      const token = generateSecureToken();

      // Armazenar em Redis ou similar para verificação posterior
      return token;
   },

   validateToken: async (token: string, csrfCookie: string) => {
      // Validar token contra cookie
      return token === csrfCookie;
   }
};
```

#### **Rate Limiting**

```typescript
// src/server/auth/rate-limit.ts
export const rateLimit = {
   check: async (ip: string, action: string) => {
      // Implementação de rate limiting baseado em Redis ou similar
      // Limita tentativas de login, criação de conta, etc.
   }
};
```

### **Configurações no .env**

**Configurações Necessárias** para autenticação:

```bash
# Configuração Geral
SESSION_SECRET="sua-chave-secreta-muito-segura"
APP_URL="http://localhost:3000"

# OAuth - GitHub
GITHUB_CLIENT_ID="seu-client-id"
GITHUB_CLIENT_SECRET="seu-client-secret"

# OAuth - Google
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# Email (para Magic Link)
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="seu-email@example.com"
EMAIL_SERVER_PASSWORD="sua-senha"
EMAIL_FROM="noreply@example.com"
```

### **Boas Práticas de Autenticação**

1. **SEMPRE** use HTTPS em ambientes de produção
2. **SEMPRE** defina tempo de expiração para sessões
3. **SEMPRE** inclua proteções contra CSRF em todas as rotas de autenticação
4. **SEMPRE** implemente rate limiting para prevenir brute force
5. **SEMPRE** armazene senhas com hashing seguro (bcrypt/Argon2)
6. **NUNCA** inclua dados sensíveis nos tokens JWT (se utilizar)
7. **NUNCA** armazene tokens de sessão em localStorage
8. **SEMPRE** utilize cookies seguros (httpOnly, SameSite=Strict)

### **Fluxo de Login**

1. Usuário acessa página de login
2. Seleciona um método de autenticação (OAuth, Magic Link, Credenciais)
3. Sistema valida as informações
4. Se autenticado com sucesso:
   - Cria sessão no banco de dados
   - Define cookie seguro com token de sessão
   - Redireciona para página inicial ou página solicitada
5. Se falhar:
   - Apresenta mensagem de erro apropriada
   - Registra tentativa (para rate limiting)
   - Mantém usuário na página de login
