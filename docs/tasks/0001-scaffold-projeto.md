# Tarefa 0001 — Scaffold inicial do projeto

## Objetivo
Criar a base do projeto Next.js (App Router + TypeScript) dentro deste repositório,
reaproveitando o protótipo visual que já existe em prototype/index.html como referência
de layout (não precisa ser pixel-perfect ainda).

## Escopo
1. Inicializar projeto Next.js + TypeScript na raiz (ou em /app, a definir pela estrutura
   padrão do Next.js), com ESLint configurado.
2. Instalar e configurar Drizzle ORM apontando para Postgres (Neon), lendo a connection
   string de uma variável de ambiente DATABASE_URL (criar .env.example, NUNCA .env real).
3. Criar o schema inicial do banco (apenas o schema em código, SEM rodar migration ainda):
   - usuarios (id, matricula, nome, perfil[admin|gestor|motorista], lotacao, ativo)
   - veiculos (id, placa, modelo, lotacao, status, km_atual)
   - audit_log (id, usuario_id, acao, entidade, entidade_id, criado_em) — somente INSERT
4. Recriar a navegação lateral e o layout geral (sidebar + topo) como componentes React,
   usando o prototype/index.html como referência visual.
5. Página inicial (dashboard) pode ficar com dados mockados por enquanto.

## Fora do escopo (não fazer ainda)
- Não implementar autenticação real ainda
- Não rodar migration no banco Neon
- Não implementar as telas internas de cada aba (isso vem em tarefas seguintes)

## Critérios de aceite
- `npm run dev` sobe o projeto localmente sem erro
- Sidebar e navegação entre seções replicam o protótipo
- Schema do Drizzle compila sem erro, mas nenhuma migration foi executada
- Nenhum segredo commitado (.env está no .gitignore)
- Commit final descreve exatamente o que foi feito

## Ao concluir
Pare e aguarde revisão antes de prosseguir para a próxima tarefa.
