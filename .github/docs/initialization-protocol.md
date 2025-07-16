# Protocolo de Inicialização

## 🔄 Protocolo de Inicialização do Projeto

**SEMPRE** execute estes passos **ANTES** de qualquer desenvolvimento:

### **1. Verificação e Configuração do Banco de Dados**

```bash
# 1. Verificar se existe docker-compose.yml
ls docker-compose.yml

# 2. Se não existir, criar arquivo docker-compose.yml
```

**Exemplo de docker-compose.yml personalizado:**

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

   # Opcional: PgAdmin
   pgadmin:
      image: dpage/pgadmin4:latest
      container_name: ${PROJECT_NAME:-projeto}-pgadmin
      restart: unless-stopped
      environment:
         PGADMIN_DEFAULT_EMAIL: ${PGADMIN_EMAIL:-admin@admin.com}
         PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD:-admin}
      ports:
         - "${PGADMIN_PORT:-5050}:80"
      networks:
         - app-network
      depends_on:
         - postgres

volumes:
   postgres_data:
      driver: local

networks:
   app-network:
      driver: bridge
```

### **2. Configuração das Variáveis de Ambiente**

```bash
# Verificar/criar arquivo .env com variáveis específicas do projeto
```

**Exemplo de .env personalizado:**

```bash
# Configurações do Projeto
PROJECT_NAME=meu-projeto

# Banco de Dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/meu_projeto_db"
DATABASE_NAME=meu_projeto_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_PORT=5432

# PgAdmin (Opcional)
PGADMIN_EMAIL=admin@meudominio.com
PGADMIN_PASSWORD=senha_segura
PGADMIN_PORT=5050
```

### **3. Scripts Package.json**

Verificar se existem os scripts necessários no `package.json`:

```json
{
   "scripts": {
      "db:up": "docker-compose up -d postgres",
      "db:down": "docker-compose down",
      "db:logs": "docker-compose logs -f postgres",
      "db:migrate": "prisma migrate dev",
      "db:reset": "prisma migrate reset",
      "db:studio": "prisma studio",
      "db:seed": "tsx prisma/seed.ts",
      "db:generate": "prisma generate"
   }
}
```

### **4. Inicialização e Teste**

```bash
# 1. Subir o banco de dados
pnpm db:up

# 2. Verificar se está rodando
docker ps

# 3. Executar migrations (se existirem)
pnpm db:migrate

# 4. Testar conexão
pnpm db:studio
```

### **5. Checklist de Verificação Inicial**

- [ ] ✅ Arquivo `docker-compose.yml` existe e está configurado
- [ ] ✅ Nomes de containers são únicos (não conflitam com outros projetos)
- [ ] ✅ Variáveis de ambiente no `.env` estão configuradas
- [ ] ✅ Scripts do `package.json` estão configurados
- [ ] ✅ Banco PostgreSQL 17 está rodando (`docker ps`)
- [ ] ✅ Conexão com banco está funcionando (`pnpm db:studio`)
- [ ] ✅ Migrations aplicadas (se existirem)
- [ ] ✅ Prisma Client gerado (`pnpm db:generate`)

**⚠️ IMPORTANTE:** Só prossiga com o desenvolvimento após confirmar que todos os itens do checklist estão ✅.
