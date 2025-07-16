# Metodologia de Desenvolvimento

## 🔄 Metodologia de Desenvolvimento Feature por Feature

### **Princípios Fundamentais**

- **SEMPRE** implemente uma feature completa por vez, de forma funcional.
- **SEMPRE** desenvolva etapa por etapa, seguindo uma ordem lógica de implementação.
- **NUNCA** misture múltiplas features em uma única implementação.
- **OBRIGATÓRIO**: Ao finalizar qualquer módulo/feature, **SEMPRE** pare e aguarde instruções do usuário antes de
  continuar.

### **Ciclo de Desenvolvimento**

1. **Planejamento**: Entenda os requisitos e as regras de negócio.
2. **Verificação**: Configure ambiente e banco de dados.
3. **Desenvolvimento Backend**: Implemente primeiro os schemas, routers tRPC e a lógica de negócio.
4. **Desenvolvimento Frontend**: Implemente os componentes de UI e a integração com o backend.
5. **Finalização**: Prepare documentação e instruções para testes.
6. **PARE**: Aguarde validação do usuário.

### **Validação pelo Usuário**

**CRÍTICO - VALIDAÇÃO DO USUÁRIO:** **NUNCA** tente testar ou validar funcionalidades sozinho. **SEMPRE** peça para o
usuário:

1. Executar o projeto (`pnpm dev`)
2. Acessar pelo navegador
3. Testar a funcionalidade implementada
4. Fornecer feedback sobre funcionamento e possíveis erros

### **Protocolo de Desenvolvimento**

#### **Etapa 1: Análise e Preparação**

- Leia e entenda completamente `.project-business-rules.md`
- Esclareça qualquer dúvida sobre requisitos antes de começar
- Verifique o banco de dados e o ambiente de desenvolvimento
- Configure rotas e permissões em `route-control.ts`

#### **Etapa 2: Implementação Backend**

- Defina schemas Zod para validação
- Implemente modelos Prisma se necessário
- Crie migrations para atualizações do banco
- Implemente routers tRPC com validações de permissões
- Teste as APIs com ferramentas como Postman ou no Playground tRPC

#### **Etapa 3: Implementação Frontend**

- Implemente os componentes da feature
- Conecte com as APIs tRPC
- Implemente formulários com validação
- Configure rotas e páginas no Next.js App Router
- Implemente controle de UI baseado em permissões

#### **Etapa 4: Finalização**

- Verifique implementação contra o checklist de features
- Prepare instruções claras para teste
- **PARE** e solicite validação do usuário
- Aguarde feedback antes de continuar

### **Tratamento de Feedback e Correções**

1. Analise o feedback do usuário com atenção
2. Priorize correções críticas
3. Implemente ajustes solicitados
4. Solicite nova validação
5. Se o módulo for aprovado, só então continue com o próximo

### **IMPORTANTE: Verificação Inicial**

**ANTES** de iniciar qualquer desenvolvimento, **SEMPRE**:

1. Verificar se existe arquivo `docker-compose.yml` na raiz do projeto
2. Se não existir, criar e configurar com PostgreSQL 17
3. Verificar se o nome do container e banco estão adequados ao projeto
4. Renomear se necessário para evitar conflitos
5. Configurar variáveis de ambiente no `.env`
6. Testar a conexão com o banco
