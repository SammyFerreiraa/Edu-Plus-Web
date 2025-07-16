# Protocolo de Resolução de Erros

## 🐛 Protocolo de Resolução de Erros

### **Processo Estruturado para Resolução de Problemas**

Ao enfrentar erros durante o desenvolvimento, siga este protocolo de forma rigorosa:

### **Primeira Tentativa**

1. **Analise o erro**:
   - Leia atentamente a mensagem de erro
   - Identifique o arquivo e linha onde ocorreu
   - Verifique a pilha de chamadas (stack trace)
2. **Entenda o contexto**:
   - Qual funcionalidade estava tentando implementar?
   - Quais alterações recentes podem ter causado o problema?
3. **Proponha solução inicial**:
   - Baseada na análise do erro e do contexto
   - Aplique a correção mais provável
   - Teste se o problema foi resolvido

### **Segunda Tentativa**

Se o erro persistir após a primeira tentativa:

1. **Faça uma análise mais profunda**:
   - Examine o fluxo de dados completo
   - Verifique se há problemas de tipagem ou validação
   - Consulte a documentação oficial das bibliotecas envolvidas
2. **Verifique dependências**:
   - Confira se todas as dependências estão instaladas
   - Verifique se há conflitos de versão
   - Considere problemas de cache (`pnpm store prune`)
3. **Implemente correção revisada**:
   - Baseada na análise mais profunda
   - Aplique a solução e teste novamente
   - Documente o que foi tentado

### **Terceira Tentativa - Solicitação de Ajuda**

Se o erro ainda persistir, **PARE** e colete informações detalhadas para o usuário:

1. **Solicite ao usuário**:
   - Screenshot do erro completo
   - Log do console do navegador (F12 > Console)
   - Log do terminal onde o projeto está rodando
   - Descrição exata do que estava tentando fazer
   - Qual funcionalidade específica estava usando
2. **Forneça contexto completo**:
   - Liste todas as tentativas de solução já realizadas
   - Explique sua compreensão atual do problema
   - Sugira possíveis abordagens alternativas

### **Exemplos de Solicitação de Informações**

```
🚨 Não consegui resolver o erro na feature de upload de arquivos após duas tentativas.

Para me ajudar a identificar o problema, por favor:

1. Capture uma screenshot do erro no navegador
2. Abra o console do navegador (F12 > Console) e envie uma captura dos logs
3. Copie e envie o log do terminal onde o projeto está rodando
4. Descreva exatamente o que você estava fazendo quando o erro ocorreu:
   - Qual arquivo tentou fazer upload?
   - Em qual página/tela estava?
   - Quais ações realizou antes do erro?

Já tentei:
- Verificar configuração do middleware de upload
- Validar os tipos de arquivo aceitos
- Ajustar limites de tamanho de arquivo

Aguardo suas informações para poder resolver o problema adequadamente.
```

### **Regras Fundamentais**

1. **NUNCA** continue tentando resolver erros sem dados específicos após a segunda tentativa
2. **NUNCA** ignore erros ou implemente contornos temporários sem documentar
3. **SEMPRE** relate exatamente o que foi tentado em cada abordagem
4. **SEMPRE** obtenha informações específicas do contexto do usuário em casos persistentes
