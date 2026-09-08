## Tarefa 0006 — Aplicação das Migrations no Neon e Seed Inicial de Admin Contexto

As migrations SQL 0000, 0001 e 0002 foram geradas localmente em backend/drizzle/, porém nenhuma foi executada no banco de dados remoto (PostgreSQL Neon). A autorização explícita foi concedida pelo Abiner nesta conversa para aplicá-las, testar a integridade da trigger de imutabilidade de auditoria e rodar o seed do usuário administrador.
Objetivo

Aplicar todo o histórico de migrations no Neon, validar a estrutura de tabelas (usuarios, veiculos, audit_log, refresh_tokens), verificar se a trigger de imutabilidade bloqueia UPDATE/DELETE no audit_log, e semear o primeiro usuário administrador a partir de credenciais seguras do .env.
Escopo

1.  Migração do Banco

    Executar a migração formal no backend:
    Bash

    npm --prefix backend run db:migrate # ou npx drizzle-kit migrate com backend/drizzle.config.ts

    Validar se todas as 4 tabelas foram criadas com seus respectivos tipos e restrições.

2.  Validação da Trigger de Imutabilidade

    Executar script de verificação ou query de teste para confirmar que:

        INSERT em audit_log funciona normalmente.

        Tentativa de UPDATE em audit_log falha com exceção do PostgreSQL (RAISE EXCEPTION).

        Tentativa de DELETE em audit_log falha com exceção do PostgreSQL (RAISE EXCEPTION).

3.  Seed do Administrador Inicial

    Conferir se o arquivo backend/.env possui as variáveis necessárias (ADMIN_MATRICULA, ADMIN_NOME, ADMIN_SENHA, ADMIN_LOTACAO).

    Executar o script:
    Bash

    npm --prefix backend run seed:admin

    Validar que o usuário foi inserido com perfil 'admin' e senha com hash Argon2id seguro.

Fora do Escopo

    Não implementar endpoints de veículos nesta tarefa (escopo da Tarefa 0007).

    Não alterar código do frontend.

    Não commitar arquivos .env ou credenciais.

Critérios de Aceite

    Tabelas usuarios, veiculos, audit_log e refresh_tokens ativas no Neon.

    Trigger trg_audit_log_immutable operacional e bloqueando mutações.

    Usuário admin inserido com sucesso via script de seed.

    Commits atômicos no padrão combinado: tipo: descrição.

Passo a Passo para Execução no Terminal

Execute os comandos abaixo na raiz do projeto:
Bash

# 1. Aplicar as migrations pendentes no banco Neon

npx --prefix backend drizzle-kit migrate

# 2. Executar o seed para criar o admin inicial

npm --prefix backend run seed:admin

Registro de Commit desta Etapa

Assim que os comandos rodarem e confirmarem a migração e o seed no Neon, salve o registro da tarefa:
Bash

git add docs/tasks/0006-aplicacao-migrations-e-seed.md
git commit -m "chore: registra tarefa 0006 de aplicacao de migrations e seed no neon"
