---
applyTo: "**"
---

# Instruções para Desenvolvimento Fullstack

**Prioridade Máxima:** Adotar e seguir rigorosamente os padrões e a arquitetura definidos.

## 📑 Índice de Instruções

Este documento serve como guia central para o desenvolvimento seguindo os padrões do projeto. Cada seção contém um link
para documentação detalhada.

### ⚙️ Configuração e Inicialização

- [Gerenciador de Pacotes](./docs/package-manager.md) - **SEMPRE** utilize `pnpm`
- [Protocolo de Inicialização](./docs/initialization-protocol.md) - Passos obrigatórios antes de iniciar o
  desenvolvimento
- [Verificação do Banco de Dados](./docs/database-verification.md) - Como verificar e configurar o PostgreSQL 17

### 🏗️ Arquitetura

- [Estrutura de Pastas](./docs/folder-structure.md) - Organização de pastas **IMPERATIVA**
- [Controle de Rotas e Permissões](./docs/route-control.md) - **PRIORIDADE CRÍTICA**
- [TypeScript e Estrutura de Tipos](./docs/typescript-rules.md) - Regras de tipos e interfaces
- [Componentes UI](./docs/ui-components.md) - Componentes disponíveis e padrões de uso

### 🖥️ Backend

- [tRPC e API](./docs/trpc-api.md) - Organização dos routers e procedures
- [Banco de Dados](./docs/database.md) - PostgreSQL e Prisma
- [Sistema de Autenticação](./docs/authentication.md) - Providers e fluxos de autenticação

### 📱 Frontend

- [Features e Páginas](./docs/features-pages.md) - Organização por domínio
- [Formulários e Validação](./docs/forms-validation.md) - Zod e React Hook Form

### 📋 Processo de Desenvolvimento

- [Metodologia](./docs/development-methodology.md) - Desenvolvimento feature por feature
- [Protocolo de Finalização](./docs/completion-protocol.md) - O que fazer ao completar uma feature
- [Protocolo de Resolução de Erros](./docs/error-resolution.md) - Como lidar com erros
- [Regras de Negócio](./docs/business-rules.md) - Consulta ao `.project-business-rules.md`

### ⚠️ Práticas a Evitar

- [Práticas Proibidas](./docs/forbidden-practices.md) - O que **NÃO** fazer neste projeto

### ✅ Checklists

- [Checklist para Novas Features](./docs/feature-checklist.md) - Verificações antes de implementar

## 🚨 Regras Fundamentais

1. **SEMPRE** consulte e siga rigorosamente as regras definidas em `.project-business-rules.md` antes de implementar
   qualquer funcionalidade
2. **SEMPRE** verifique a configuração do banco de dados PostgreSQL 17 via Docker antes de iniciar
3. **SEMPRE** implemente uma feature completa por vez
4. **SEMPRE** pare após completar um módulo e aguarde validação do usuário
5. **NUNCA** teste funcionalidades sozinho - peça ao usuário para testar via navegador

---

Para mais detalhes sobre cada tópico, clique nos links correspondentes acima que levam à documentação completa.
