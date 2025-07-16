# Gerenciador de Pacotes

## 📦 Regras para Gerenciamento de Pacotes

- **OBRIGATÓRIO**: Utilize **SEMPRE** `pnpm` como gerenciador de pacotes para todas as operações.
- **NUNCA** utilize `npm` ou `yarn` para instalar dependências neste projeto.
- O arquivo `pnpm-lock.yaml` deve ser sempre commitado no repositório.

## 📝 Comandos Principais

```bash
# Instalar dependências
pnpm install

# Adicionar uma nova dependência
pnpm add <package-name>

# Adicionar uma dependência de desenvolvimento
pnpm add -D <package-name>

# Executar scripts do package.json
pnpm <script-name>
# Ex: pnpm dev, pnpm build, etc.
```

## 🔄 Atualização de Dependências

- Utilize `pnpm up` para atualizar pacotes
- Ao fazer atualizações maiores, **SEMPRE** verifique compatibilidades
- **NUNCA** atualize dependências críticas (Next.js, React, Prisma) sem consultar o projeto

## 🚧 Resolução de Problemas

Se encontrar erros relacionados a dependências:

1. Limpe o cache: `pnpm store prune`
2. Remova a pasta `node_modules`: `rm -rf node_modules`
3. Reinstale as dependências: `pnpm install`

## 📚 Leitura Adicional

- [Documentação oficial do PNPM](https://pnpm.io/pt/)
- [Benefícios do PNPM](https://pnpm.io/pt/motivation)
