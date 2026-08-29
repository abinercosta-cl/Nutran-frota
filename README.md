# FROTA PF — SNM

Sistema de controle de frota veicular — Polícia Federal (Superintendência SNM).

## Stack
- Next.js (App Router) + TypeScript
- Drizzle ORM + PostgreSQL (Neon)
- Autenticação por sessão + RBAC (admin / gestor / motorista)

## Estrutura do repositório
```
prototype/    -> protótipo HTML navegável de referência visual
docs/         -> arquitetura, tarefas e notas de segurança (docs/SECURITY.md)
src/          -> aplicação Next.js (App Router + componentes React)
src/db/       -> schemas e conexão do Drizzle ORM
```

## Como rodar o projeto localmente
1. Copie o arquivo de exemplo de ambiente:
   ```bash
   cp .env.example .env.local
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse em `http://localhost:3000`.
