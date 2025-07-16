# Banco de Dados

## 🗄️ Configuração e Uso do PostgreSQL e Prisma

### **Requisitos Fundamentais**

- **PostgreSQL 17** é o único banco de dados suportado
- Configuração **DEVE** ser feita via Docker Compose
- Containers devem ter nomes **ÚNICOS** para evitar conflitos com outros projetos
- Migrations do Prisma são **OBRIGATÓRIAS** para todas as alterações no schema

### **Configuração do Docker Compose**

**CRÍTICO:** Configure o ambiente de desenvolvimento com PostgreSQL 17 usando Docker.

```yaml
# docker-compose.yml
version: "3.8"

services:
   postgres:
      image: postgres:17-alpine
      container_name: ${PROJECT_NAME:-projeto}-db
      restart: unless-stopped
      environment:
         POSTGRES_DB: ${DATABASE_NAME:-projeto_db}
         POSTGRES_USER: ${DATABASE_USER:-postgres}
         POSTGRES_PASSWORD: ${DATABASE_PASSWORD:-postgres}
      ports:
         - "${DATABASE_PORT:-5432}:5432"
      volumes:
         - postgres_data:/var/lib/postgresql/data
      networks:
         - app-network

volumes:
   postgres_data:
      driver: local

networks:
   app-network:
      driver: bridge
```

### **Sistema de Migrations Obrigatório**

**REGRA FUNDAMENTAL:** Toda alteração no schema do banco deve ser feita através de migrations do Prisma.

**COMANDOS ESSENCIAIS:** Utilize sempre os comandos configurados no `package.json`:

```bash
# Criar e aplicar nova migration (desenvolvimento)
pnpm db:migrate

# Verificar status das migrations
pnpm db:migrate:status

# Aplicar migrations pendentes (produção)
pnpm db:migrate:deploy

# Gerar cliente Prisma após mudanças
pnpm db:generate

# Resetar banco (CUIDADO - apenas desenvolvimento)
pnpm db:reset

# Visualizar dados do banco
pnpm db:studio

# Executar seeds
pnpm db:seed
```

### **Configuração das Variáveis de Ambiente (.env)**

**CRÍTICO:** Configure as seguintes variáveis no arquivo `.env`:

```bash
# Configurações do Banco de Dados (OBRIGATÓRIO)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fullstack_template"
DATABASE_NAME=fullstack_template
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_PORT=5432
```

### **Estrutura de Arquivos do Banco**

```
prisma/
├── schema.prisma       # Schema principal do Prisma
├── models/            # Modelos separados por domínio
│   ├── user.prisma    # Modelo de usuário
│   ├── auth.prisma    # Modelos de autenticação
│   └── [domain].prisma # Outros modelos de domínio
├── migrations/        # Migrations do Prisma (auto-geradas)
├── seed.ts           # Script de seed para dados iniciais
└── README.md         # Documentação do banco
```

### **Exemplo de Schema Prisma**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Importar modelos de outros arquivos
@@include("./models/user.prisma")
@@include("./models/auth.prisma")
```

```prisma
// prisma/models/user.prisma
enum UserRole {
  MEMBER
  MANAGER
  ADMIN
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  role      UserRole @default(MEMBER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relacionamentos com autenticação
  accounts Account[]
  sessions Session[]

  @@map("users")
}
```

### **Gerenciamento do Banco**

```bash
# Iniciar o banco de dados
pnpm db:up

# Parar o banco de dados
pnpm db:down

# Verificar logs
docker-compose logs -f postgres

# Acessar o banco via CLI
docker exec -it <nome-do-container> psql -U postgres -d <nome-do-banco>
```

### **Testes de Conectividade**

**SEMPRE** verifique se o Prisma consegue se conectar ao banco:

```bash
# Testar conexão do Prisma
npx prisma db pull

# Abrir Prisma Studio para visualizar dados
pnpm db:studio
```

### **Configuração do Cliente Prisma**

```typescript
// src/server/config/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
   prisma: PrismaClient | undefined;
};

export const db =
   globalForPrisma.prisma ??
   new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
   });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

### **Script de Seed (Opcional)**

```typescript
// prisma/seed.ts
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
   // Criar usuário admin padrão
   const adminUser = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {},
      create: {
         email: "admin@example.com",
         name: "Administrador",
         role: UserRole.ADMIN
      }
   });

   console.log("Seed concluído:", { adminUser });
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
```

### **Resolução de Problemas Comuns**

1. **Erro "connection refused"**:

   - Verifique se o container do PostgreSQL está rodando (`docker ps`)
   - Confirme as credenciais no `.env`
   - Verifique se a porta 5432 está disponível

2. **Erro "database does not exist"**:

   - Crie o banco manualmente: `docker exec -it <nome-do-container> createdb -U postgres <nome-do-banco>`

3. **Erro de migração**:
   - Verifique histórico: `npx prisma migrate status`
   - Em ambiente de desenvolvimento, considere resetar: `pnpm db:reset`
