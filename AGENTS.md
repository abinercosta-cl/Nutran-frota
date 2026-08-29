# AGENTS.md — FROTA PF SNM

## Projeto
Sistema de controle de frota veicular da Polícia Federal (Superintendência SNM).
Uso interno, dados sensíveis. Ver docs/SECURITY.md antes de qualquer alteração.

## Stack
- Next.js (App Router) + TypeScript
- Drizzle ORM + PostgreSQL (Neon)
- Autenticação por sessão + RBAC (admin / gestor / motorista)

## Convenções
- Commits em português, no padrão: tipo: descrição (ex.: feat: tela de veículos)
- Nunca usar `any` em TypeScript
- Toda ação sensível (saída de VT, aprovação, edição de usuário) deve gravar em audit_log
- Nenhum dado real (placas, nomes, matrículas) em seeds ou exemplos — sempre fictício

## Regras obrigatórias de segurança (não negociáveis)
- NUNCA commitar .env, chaves, tokens ou strings de conexão
- NUNCA rodar migration de banco (drizzle-kit push/migrate) sem aprovação explícita minha
- NUNCA remover ou alterar a tabela audit_log para permitir UPDATE/DELETE
- Peça confirmação antes de qualquer comando destrutivo (drop, delete, force push)

## Tarefas
Cada tarefa vem descrita em docs/tasks/NNNN-nome.md — siga exatamente o escopo e os
critérios de aceite descritos lá. Se algo não estiver claro, pare e pergunte em vez de assumir.
