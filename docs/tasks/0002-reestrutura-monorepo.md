# Tarefa 0002 — Reestruturar em /backend e /frontend separados

## Contexto
A Tarefa 0001 foi executada por engano usando o escopo antigo (Next.js full-stack).
Isso violou a decisão de arquitetura registrada em AGENTS.md (backend e frontend
separados). Esta tarefa corrige a estrutura SEM jogar fora o trabalho visual e de
schema que já está pronto e é reaproveitável.

## Objetivo
Reorganizar o repositório em dois projetos independentes: /backend (Express + Drizzle)
e /frontend (React + Vite), removendo por completo o Next.js.

## Escopo

### Backend (/backend)
1. Criar /backend como projeto Node.js + TypeScript + Express (do zero, conforme já
   descrito em docs/tasks/0001-scaffold-backend.md — siga aquele escopo à risca).
2. Mover para /backend o que já existe e é aproveitável de src/db/:
   - schema.ts (schema Drizzle: usuarios, veiculos, audit_log)
   - index.ts (client Drizzle Neon HTTP)
   - drizzle.config.ts
   - .env.example
3. Expor por enquanto só GET /health — as rotas de cada módulo vêm em tarefas futuras.

### Frontend (/frontend)
1. Criar /frontend como projeto Vite + React + TypeScript (do zero, `npm create vite@latest`).
2. Migrar os componentes visuais já existentes em src/components/ para /frontend/src/components/,
   adaptando qualquer import específico de Next.js (ex.: next/link, next/image) para
   equivalentes padrão do React/Vite. Não usar App Router — usar react-router-dom para
   as rotas entre as abas (Veículos, Saída, Cautelas, Oficina, OS, Alertas, Manutenção,
   Saldo, Usuários), mantendo a mesma navegação lateral já construída.
3. Migrar src/app/globals.css (variáveis de tema, tipografia) para /frontend/src/,
   mantendo o visual atual (tema escuro institucional).
4. As páginas mockadas (veiculos/page.tsx, saida/page.tsx etc.) devem virar componentes
   de página em /frontend/src/pages/, mantendo os dados mockados como estão por enquanto
   — sem chamada real à API do backend ainda (isso é tarefa futura).

### Remoção
5. Remover completamente: next.config.*, next-env.d.ts, dependências do Next.js no
   package.json raiz, e qualquer resquício de estrutura App Router.
6. Remover o package.json/tsconfig da raiz antiga (cada projeto — backend e frontend —
   tem o seu próprio).

## Fora do escopo
- Não conectar frontend ao backend via fetch/API ainda (próxima tarefa)
- Não rodar migration no Neon
- Não implementar autenticação

## Critérios de aceite
- `/backend`: `npm run dev` sobe servidor Express, GET /health responde 200
- `/frontend`: `npm run dev` sobe o Vite, navegação lateral entre todas as abas funciona,
  visual idêntico ao que já estava no Next.js
- Nenhum vestígio de Next.js no repositório
- Nenhuma migration executada, nenhum .env real commitado
- Um commit por etapa lógica (ex.: um commit pro backend, um pro frontend, um pra remoção
  do Next.js) — não um commit único gigante

## Ao concluir
Pare e aguarde revisão do Abiner antes de qualquer integração frontend↔backend.
