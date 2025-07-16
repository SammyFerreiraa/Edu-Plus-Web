# Checklist para Novas Features

## ✅ Checklist Obrigatório para Novas Features

Antes de iniciar a implementação de qualquer nova funcionalidade, **REVISE E CONFIRME** os seguintes pontos:

### **🚨 Requisitos Críticos**

- [ ] **🚨 CRÍTICO:** Verificou e configurou o Docker Compose com PostgreSQL 17
- [ ] **🚨 CRÍTICO:** Testou a conexão com o banco de dados
- [ ] **🚨 CRÍTICO:** Consultou `.project-business-rules.md` para entender todas as regras de negócio específicas
- [ ] **🚨 CRÍTICO:** Esclareceu qualquer dúvida sobre regras de negócio com o usuário antes de implementar
- [ ] **🚨 CRÍTICO:** Configurou a rota em `/src/config/route-control.ts` com os roles apropriados
- [ ] **🚨 CRÍTICO:** Implementou verificações de permissão usando `/src/common/permissions.ts`

### **💾 Banco de Dados**

- [ ] Configurou APIs externas na pasta `/src/server/external/` se necessário
- [ ] Utilizou migrations do Prisma para todas as alterações no schema
- [ ] Todas as migrations foram aplicadas e estão sincronizadas
- [ ] Credenciais de APIs externas estão configuradas no `.env`

### **🖥️ Backend**

- [ ] Routers tRPC estão em `/src/server/routers/` e seguem a estrutura definida
- [ ] Schemas Zod para validação estão definidos em `/src/common/schemas/`
- [ ] A autenticação utiliza o sistema de providers e hooks existentes

### **📱 Frontend**

- [ ] A feature está organizada corretamente em `/src/interface/features/[nome-da-feature]/`
- [ ] Está utilizando os componentes UI existentes em `/src/interface/components/ui/`
- [ ] Páginas seguem a estrutura de pastas do App Router do Next.js
- [ ] Estilos seguem o padrão Tailwind CSS
- [ ] Verificou `.project-business-rules.md` para padrões de design específicos
- [ ] Foram considerados e testados diferentes roles de usuário (MEMBER, MANAGER, ADMIN)

### **🔄 Processo**

- [ ] **NOVO:** Plano para parar após completar o módulo e aguardar validação do usuário
- [ ] **NOVO:** Preparado para solicitar teste pelo usuário via navegador antes de continuar
- [ ] **NOVO:** Estratégia para coletar informações específicas do usuário em caso de erro após segunda tentativa

### **📝 Verificação Final**

Complete este checklist antes de começar a implementação para garantir que todos os requisitos e padrões do projeto
serão atendidos.

**⚠️ IMPORTANTE:** Se algum item crítico não puder ser cumprido, consulte o usuário antes de prosseguir.

### **🔁 Processo de Verificação Periódica**

Durante o desenvolvimento da feature, verifique periodicamente:

1. Se todas as regras de negócio estão sendo seguidas
2. Se o código está seguindo os padrões de arquitetura
3. Se as permissões estão sendo verificadas corretamente
4. Se as validações de formulários estão completas
5. Se a UI está responsiva e acessível

### **📚 Recursos de Apoio**

- [Controle de Rotas e Permissões](./route-control.md)
- [TypeScript e Estrutura de Tipos](./typescript-rules.md)
- [Protocolo de Finalização](./completion-protocol.md)
- [Protocolo de Resolução de Erros](./error-resolution.md)
