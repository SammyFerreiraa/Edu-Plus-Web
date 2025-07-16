# Estrutura de Pastas

## 📁 Estrutura de Pastas do Projeto

A estrutura de pastas deste projeto segue um padrão cuidadosamente projetado para organização e separação de
responsabilidades. É **IMPERATIVO** seguir essa estrutura ao adicionar novos arquivos.

### **Visão Geral da Estrutura**

```
src/
├── interface/          # Frontend (React/Next.js)
│   ├── components/     # Componentes reutilizáveis
│   │   ├── ui/         # Componentes base (Button, Input, etc.)
│   │   ├── auth-provider.tsx
│   │   ├── card.tsx, form.tsx
│   │   ├── sidebar/    # Navegação
│   │   └── icons/      # Ícones customizados
│   ├── features/       # Features por domínio (ex: /login, /home)
│   ├── hooks/          # Hooks customizados (useSession.ts)
│   ├── styles/         # Estilos globais e utilitários
│   └── utils/          # Utilitários da interface
├── server/             # Backend (tRPC/Prisma)
│   ├── actions/        # Server Actions do Next.js
│   ├── auth/           # Sistema modular de autenticação
│   │   ├── providers/  # Providers OAuth (Google, GitHub, Magic Link)
│   │   ├── manager.ts  # Gerenciador central
│   │   └── utils.ts, csrf-protection.ts, rate-limit.ts
│   ├── config/         # Configurações (Prisma, tRPC)
│   ├── domain/         # Lógica de domínio
│   ├── external/       # Integrações externas (Email, APIs)
│   │   └── email/      # Sistema de email configurado (Nodemailer + React Email)
│   ├── routers/        # Routers tRPC por domínio
│   └── utils/          # Utilitários do servidor
├── common/             # Código compartilhado
│   ├── schemas/        # Schemas Zod
│   ├── auth.ts         # Lógica principal de autenticação (SSR)
│   ├── auth-edge.ts    # Edge Runtime (middleware)
│   ├── config.ts, permissions.ts
│   └── utils compartilhados
├── config/             # Configurações gerais
│   ├── env.js, route-control.ts
│   └── trpc/           # Configuração tRPC
```

### **Estrutura Detalhada**

#### **1. Interface (Frontend)**

Contém tudo relacionado à interface do usuário:

```
interface/
├── components/         # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Input, etc.)
│   ├── sidebar/        # Navegação
│   └── icons/          # Ícones customizados
├── features/           # Organizado por domínio
│   ├── auth/           # Feature de autenticação
│   │   ├── login-form.tsx
│   │   └── index.tsx   # Exporta componentes principais
│   ├── dashboard/      # Feature de dashboard
│   │   └── ...
│   └── [domain-name]/  # Outras features por domínio
│       ├── components/ # Componentes específicos da feature
│       ├── hooks/      # Hooks específicos da feature
│       └── index.tsx   # Exporta componente principal
├── hooks/              # Hooks globais compartilhados
├── styles/             # Estilos globais e utilitários
└── utils/              # Utilidades frontend
```

#### **2. Server (Backend)**

Contém toda a lógica de servidor:

```
server/
├── actions/            # Server Actions do Next.js
│   ├── auth.ts         # Ações relacionadas à autenticação
│   └── [domain].ts     # Ações organizadas por domínio
├── auth/               # Sistema de autenticação
│   ├── providers/      # Providers (Google, GitHub, etc.)
│   └── ...
├── config/             # Configurações do servidor
│   ├── prisma.ts       # Cliente do Prisma
│   └── trpc.ts         # Configuração do tRPC
├── domain/             # Lógica de domínio
│   ├── user.ts
│   └── [domain].ts
├── external/           # Integrações externas
│   ├── email/
│   └── [service-name]/
├── routers/            # Routers tRPC (organizado por domínio)
│   ├── auth/
│   │   ├── repository.ts    # Acesso direto ao banco
│   │   ├── router.ts        # Definição do router
│   │   └── methods/         # Lógica complexa separada
│   │       ├── login.ts
│   │       └── register.ts
│   └── [domain]/            # Outros domínios seguem mesmo padrão
└── utils/              # Utilitários do servidor
```

#### **3. App (Pages)**

A estrutura de pastas do App Router do Next.js:

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

### **Diretrizes para Localização de Arquivos**

#### **Onde colocar novos arquivos:**

- **Componentes UI Reutilizáveis**: `/src/interface/components/ui/`
- **Componentes Específicos de Feature**: `/src/interface/features/[feature-name]/components/`
- **Páginas**: `/src/app/` seguindo estrutura do App Router
- **Lógica de Negócio**: `/src/server/routers/[domain]/`
- **Validação com Zod**: `/src/common/schemas/`
- **Integrações Externas**: `/src/server/external/[service-name]/`
- **Configurações de Rota**: `/src/config/route-control.ts`

### **IMPORTANTE**

- **SEMPRE** mantenha cada funcionalidade dentro do seu domínio específico
- **NUNCA** crie pastas fora da estrutura estabelecida
- **SEMPRE** use exports adequados (exports nomeados vs. export default)
- **SEMPRE** separe lógica de servidor dos componentes de cliente
- Prefira a abordagem "feature-first" para organização de código
