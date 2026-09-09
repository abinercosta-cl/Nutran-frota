# Tarefa 0007 — CRUD de Veículos com RBAC e Auditoria Imutável

## Contexto

Com as migrations aplicadas no Neon, trigger de imutabilidade testada e o primeiro admin cadastrado (Tarefa 0006), o sistema agora precisa dos endpoints operacionais da entidade central: Veículos. Todas as operações de escrita devem ser restritas por perfil (RBAC) e obrigatoriamente auditadas na tabela `audit_log`.

## Objetivo

Implementar o CRUD completo de veículos (`/veiculos`), aplicando validação com schemas (Zod), controle de acesso (`admin` e `gestor` para mutações; `motorista` apenas leitura) e gravação automática de eventos em `audit_log`.

## Escopo

### 1. Camada de Validação & DTOs (`backend/src/schemas/veiculo.schema.ts`)

- Criar schemas com Zod:
  - `createVeiculoSchema`: placa (padrão Mercosul/antigo limpo e em caixa alta), modelo, lotacao, status (default: 'disponivel'), km_atual (número inteiro >= 0).
  - `updateVeiculoSchema`: todos os campos opcionais, mas com a mesma validação estrita.
  - `queryVeiculosSchema`: filtros por `status`, `lotacao` e termo de busca (`busca` por placa ou modelo).

### 2. Service de Veículos (`backend/src/services/veiculo.service.ts`)

- `listarVeiculos(filtros)`: listagem com filtros dinâmicos, ordenação padrão por placa.
- `buscarVeiculoPorId(id)`: retorna dados do veículo ou 404.
- `criarVeiculo(dados, usuarioId)`:
  - Verificar unicidade de placa.
  - Inserir veículo no banco.
  - Registrar evento em `audit_log` (acao: 'CRIAR_VEICULO', entidade: 'veiculos', entidade_id: veiculo.id, usuario_id: usuarioId).
- `atualizarVeiculo(id, dados, usuarioId)`:
  - Verificar existência.
  - Atualizar registro.
  - Registrar evento em `audit_log` (acao: 'ATUALIZAR_VEICULO', entidade: 'veiculos', entidade_id: id, usuario_id: usuarioId).
- `desativarVeiculo(id, usuarioId)`:
  - Não fazer hard delete no banco caso haja dependências; alterar status para inativo/baixado ou implementar remoção segura se não houver vínculos operacionais.
  - Registrar evento em `audit_log` (acao: 'DELETAR_VEICULO' ou 'BAIXAR_VEICULO').

### 3. Middlewares e Rotas (`backend/src/routes/veiculo.routes.ts`)

- Configurar rotas montadas em `/veiculos` no `backend/src/index.ts`:
  - `GET /veiculos` -> protegido por `authMiddleware` (todos os perfis autenticados: admin, gestor, motorista).
  - `GET /veiculos/:id` -> protegido por `authMiddleware`.
  - `POST /veiculos` -> protegido por `authMiddleware` + `requireRole('admin', 'gestor')`.
  - `PUT /veiculos/:id` -> protegido por `authMiddleware` + `requireRole('admin', 'gestor')`.
  - `DELETE /veiculos/:id` -> protegido por `authMiddleware` + `requireRole('admin')`.

### 4. Testes Manuais / Verificação

- Criar script ou chamada de teste para:
  1. Tentar criar veículo sem token -> 401 Unauthorized.
  2. Tentar criar veículo com perfil `motorista` -> 403 Forbidden.
  3. Criar veículo com token de `admin` -> 201 Created.
  4. Conferir se a criação inseriu a linha correspondente em `audit_log`.

## Fora do Escopo

- Não integrar com telas do frontend nesta tarefa (tarefa futura de integração de telas).
- Não alterar regras de Saída/Devolução ou Cautela (tarefas posteriores).
- Não commitar arquivos `.env` ou dados sensíveis.

## Critérios de Aceite

- Endpoints respondendo adequadamente conforme perfil autenticado.
- Todas as mutações (`POST`, `PUT`, `DELETE`) gravando eventos no `audit_log`.
- Zero uso de `any` no TypeScript.
- Código formatado e sem warnings de tipagem.
- Commit no padrão: `tipo: descrição`.
