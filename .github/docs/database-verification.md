# Verificação do Banco de Dados

## 🚨 Verificação Obrigatória do Banco de Dados

A configuração e verificação do banco de dados é uma etapa **CRÍTICA** antes de iniciar qualquer desenvolvimento.

### **Requisitos Fundamentais**

- **PostgreSQL 17** é o único banco de dados suportado
- Configuração **DEVE** ser feita via Docker Compose
- Containers devem ter nomes **ÚNICOS** para evitar conflitos com outros projetos
- Migrations do Prisma são **OBRIGATÓRIAS** para todas as alterações no schema

### **Verificação da Instalação**

Execute os seguintes comandos para garantir que o ambiente está configurado corretamente:

```bash
# Verificar se o Docker está rodando
docker ps

# Verificar se o PostgreSQL 17 está instalado e funcionando
docker exec -it <nome-do-container> psql -U postgres -c "SELECT version();"
```

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
