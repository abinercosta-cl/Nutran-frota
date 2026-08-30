# Tarefa 0003 — Testar conexão real e gerar a primeira migration

## Objetivo

Confirmar que o backend consegue se conectar ao Neon usando o .env real, e gerar
(sem aplicar) os arquivos de migration a partir do schema Drizzle já existente.

## Escopo

1. Criar um script simples em /backend (ex.: src/db/check-connection.ts) que executa
   uma query trivial (ex.: SELECT 1) usando o client Drizzle e imprime sucesso/erro.
2. Rodar `drizzle-kit generate` para gerar os arquivos SQL de migration a partir do
   schema atual (usuarios, veiculos, audit_log) — isso só cria arquivos locais,
   NÃO altera o banco.
3. Listar os arquivos de migration gerados para revisão.

## Fora do escopo — NÃO FAZER

- NÃO rodar `drizzle-kit push` nem `drizzle-kit migrate` (aplicar no banco real)
- Isso só acontece depois que eu (Abiner) revisar o SQL gerado e aprovar explicitamente

## Critérios de aceite

- Script de teste de conexão roda e confirma sucesso contra o Neon real
- Arquivos de migration gerados existem em /backend (pasta padrão do drizzle-kit,
  ex. /backend/drizzle) e estão prontos para revisão
- Nenhuma alteração real foi feita no banco

## Ao concluir

Pare e me mostre o conteúdo do SQL gerado. Aplicar a migration é decisão minha,
tomada nesta conversa, não automática.
