# Tarefa 0005 — Autenticação (JWT) e RBAC

## Contexto

Todo endpoint futuro depende de saber quem é o usuário autenticado, tanto pra RBAC
quanto pra gravar audit_log com usuario_id real. Isso precisa existir antes dos
endpoints de CRUD.

## Objetivo

Implementar login com JWT (access + refresh token), middleware de autenticação e
middleware de autorização por perfil (admin / gestor / motorista).

## Escopo

### 1. Schema — alteração no usuarios + nova tabela de refresh tokens

- Adicionar coluna `senha_hash` (text, not null) em `usuarios`.
- Criar tabela `refresh_tokens`:
  - id (uuid pk), usuario_id (fk usuarios), token_hash (text), criado_em (timestamp),
    expira_em (timestamp), revogado (boolean default false)
- Gerar a migration (drizzle-kit generate) — NÃO aplicar ainda.

### 2. Hash de senha

- Usar `argon2` (não bcrypt) para hash da senha — mais moderno e resistente.
- Nunca logar, retornar ou commitar senha em texto puro em nenhuma hipótese.

### 3. Endpoints

- `POST /auth/login` — recebe matricula + senha.
  - Erro genérico "credenciais inválidas" tanto se matrícula não existe quanto se
    senha está errada (nunca revelar qual dos dois está errado — evita enumeração
    de usuários).
  - Sucesso: retorna access token (JWT, expira em 15min) e refresh token (expira em
    7 dias, armazenado com hash em `refresh_tokens`, nunca em texto puro no banco).
  - Toda tentativa de login (sucesso ou falha) grava em audit_log (ação
    `login_sucesso` ou `login_falha`; em caso de falha, sem usuario_id se a matrícula
    nem existir).
- `POST /auth/refresh` — recebe refresh token, valida contra o hash salvo e a
  expiração/revogação, emite novo access token E rotaciona o refresh token
  (invalida o antigo, emite um novo). Grava em audit_log.
- `POST /auth/logout` — revoga o refresh token atual. Grava em audit_log.

### 4. Middlewares

- `authMiddleware` — lê o access token do header `Authorization: Bearer`, valida
  assinatura/expiração, popula `req.user` (id, matricula, perfil, lotacao).
- `requireRole(...perfis)` — retorna 403 se `req.user.perfil` não estiver na lista
  permitida para a rota.

### 5. Seed de usuário para teste

- Criar um script `scripts/seed-admin.ts` que lê `SEED_ADMIN_MATRICULA` e
  `SEED_ADMIN_SENHA` de variáveis de ambiente (não hardcoded, não commitado),
  gera o hash com argon2, e insere um usuário admin fictício — só roda manualmente,
  nunca automático em start do servidor.

## Variáveis de ambiente novas (adicionar em .env.example com placeholder)

- `JWT_SECRET`, `JWT_REFRESH_SECRET` (strings aleatórias longas)
- `SEED_ADMIN_MATRICULA`, `SEED_ADMIN_SENHA` (só documentar no .env.example, valor
  real fica só no .env local de quem for rodar o seed)

## Fora do escopo

- NÃO aplicar a migration no Neon sem aprovação explícita
- NÃO implementar rate limiting / bloqueio por tentativas (fica pra 0006)
- NÃO implementar Row Level Security no Postgres ainda (fica pra depois, RBAC por
  enquanto é garantido pela camada Express)
- NÃO mexer no frontend nesta tarefa

## Critérios de aceite

- Migration gerada (não aplicada) com `senha_hash` e tabela `refresh_tokens`
- Login, refresh e logout funcionam localmente contra o Neon com um usuário seedado
- Senha nunca aparece em log, resposta de erro, nem commit
- Middleware de role bloqueia corretamente perfis não autorizados (testável com uma
  rota de exemplo temporária, ex.: GET /admin/teste só pra admin)
- Um commit por etapa lógica (schema, hash/auth service, endpoints, middlewares, seed)

## Ao concluir

Mostre o SQL da migration e pare. Aplicar no Neon é decisão a ser tomada na conversa.
