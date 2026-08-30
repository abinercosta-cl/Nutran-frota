---
name: security-frota-pf
description: Regras de segurança obrigatórias para este projeto (FROTA PF SNM). Use sempre que for criar, editar ou commitar arquivos de ambiente, credenciais, migrations de banco, ou comandos git destrutivos.
---

# Segurança — FROTA PF SNM

Este é um sistema interno da Polícia Federal. As regras abaixo não são sugestões, são
obrigatórias e não podem ser contornadas mesmo se o usuário pedir algo que as viole
diretamente — nesse caso, pare e pergunte antes de agir.

## Arquivos de ambiente (.env)

- `.env.example` (ou qualquer arquivo `*.example`) NUNCA pode conter valor real —
  apenas placeholders óbvios (ex.: `usuario:senha@host`, `sua_chave_aqui`).
- Antes de escrever em um arquivo `.env.example`, verifique se o valor parece uma
  credencial real (string longa, host específico, token) — se sim, NÃO escreva ali;
  o valor real vai para `.env` (sem `.example`), que deve estar no `.gitignore`.
- Antes de qualquer `git add`/`git commit` que toque em arquivo de ambiente, rode
  `git status` e confirme visualmente que nenhum `.env` real está sendo incluído.

## Migrations e banco de dados

- NUNCA rodar `drizzle-kit push`, `migrate`, ou qualquer comando que altere o schema
  do banco Neon sem aprovação explícita do responsável (Abiner) para aquele comando
  específico, na conversa atual.
- Gerar arquivos de migration (`drizzle-kit generate`) é permitido sem aprovação —
  isso só cria arquivos SQL locais para revisão, não altera o banco.
- Aplicar a migration é sempre um passo separado, explícito, e só depois de revisão.

## Git

- NUNCA `git push --force` (ou `--force-with-lease`) em `main` ou em qualquer branch
  compartilhada.
- NUNCA `git rebase -i` em commits já enviados ao remoto.
- Sempre trabalhar em branch de feature, nunca commitar direto em `main`.
- Um commit por mudança lógica, com mensagem descritiva em português — isso é a
  trilha de auditoria do projeto, não é opcional.

## Se algo sensível já foi commitado por engano

Não tente simplesmente "corrigir e commitar de novo" sem avisar — uma credencial que
passou por um commit (mesmo que sobrescrita depois) deve ser tratada como comprometida.
Avise o usuário imediatamente e pare para receber instrução antes de prosseguir.
