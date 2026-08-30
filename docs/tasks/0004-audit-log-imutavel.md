# Tarefa 0004 — Imutabilidade real do audit_log

## Contexto
A tabela audit_log existe e o schema está aplicado no Neon (Tarefa 0003), mas hoje
nada no banco impede um UPDATE ou DELETE nela — a "regra" existe só como convenção
documentada em AGENTS.md/SECURITY.md, não é aplicada pelo Postgres. Isso precisa virar
uma trigger real antes de qualquer dado começar a entrar na tabela.

## Objetivo
Criar uma trigger no Postgres que rejeita qualquer UPDATE ou DELETE na tabela
audit_log, gerando erro explícito se alguém (ou algum bug de código) tentar.

## Escopo
1. Escrever uma migration Drizzle (via SQL customizado, já que trigger não é modelado
   diretamente no schema.ts do Drizzle) que:
   - Cria uma função `audit_log_immutable()` que faz RAISE EXCEPTION quando chamada
   - Cria uma trigger BEFORE UPDATE OR DELETE ON audit_log que executa essa função
2. Gerar o arquivo de migration correspondente (drizzle-kit generate, ou SQL manual
   dentro da pasta de migrations seguindo o padrão já usado) — SEM aplicar ainda.
3. Documentar em docs/SECURITY.md que essa proteção agora é aplicada no banco,
   não só por convenção.

## Fora do escopo
- NÃO aplicar a migration no Neon (drizzle-kit push/migrate) sem aprovação explícita
- NÃO alterar o enum de status de veículos ainda (fica pra outra tarefa)

## Critérios de aceite
- Arquivo de migration criado com a função + trigger, pronto para revisão
- SQL gerado é claro sobre o que faz (comentários no SQL são bem-vindos)
- docs/SECURITY.md atualizado mencionando a trigger

## Ao concluir
Mostre o SQL gerado e pare. Aplicar no Neon é decisão a ser tomada na conversa,
não automática — depois de aplicado, eu mesmo vou tentar um UPDATE de teste pra
confirmar que o banco realmente rejeita.
