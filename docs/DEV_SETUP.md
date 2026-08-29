# Ambiente de desenvolvimento — FROTA PF SNM

Este documento cobre duas coisas: (1) como usar o Claude Code integrado ao seu ambiente
(Windows + WSL, ou Linux nativo) e (2) como rodar o projeto em si em cada sistema.

---

## 1. Claude Code

### 1.1 Windows com WSL2 (seu caso)

O Claude Code Desktop no Windows tem suporte nativo a WSL2: a sessão roda **dentro** da
distribuição Linux (git, toolchain, paths — tudo Linux), não no Windows. Não é uma emulação,
é o processo do Claude Code executando de fato dentro do WSL.

**Requisitos**
- Windows 10/11 com WSL2 instalado (WSL1 não é suportado)
- Ao menos uma distribuição instalada (ex.: Ubuntu)
- `git` instalado dentro da distribuição

**Passo a passo**
1. Instale o Claude Code Desktop no Windows.
2. Abra a aba **Code** → clique no seletor de ambiente.
3. Suas distribuições WSL2 instaladas aparecem numa seção **WSL** — selecione a sua (Ubuntu, etc.).
4. Escolha a pasta do projeto — a navegação já acontece dentro da distribuição, com paths
   Linux (ex.: `/home/seu_usuario/projetos/frota-pf-snm`).
5. Na primeira sessão naquela pasta, você vai confirmar a "workspace trust" — confiança é
   por distribuição + pasta (confiar no WSL não confia automaticamente no mesmo path no Windows).

**Importante — onde manter o projeto**
Mantenha o repositório **dentro do filesystem do WSL** (`/home/...`), não em `/mnt/c/...`.
Acessar arquivos que estão no Windows a partir do WSL passa por um filesystem de rede — fica
lento e quebra o file watching (hot reload, etc). Ou seja:

```bash
# dentro do WSL (Ubuntu)
mkdir -p ~/projetos
cd ~/projetos
git clone <url-do-seu-repo> frota-pf-snm
cd frota-pf-snm
```

**O que funciona numa sessão WSL:** sessões paralelas, side chats, diff visual, status de
branch/PR, worktrees — tudo usando o git e toolchain de dentro da distribuição. "Abrir no
editor" conecta o VS Code via extensão Remote - WSL.

**O que ainda não funciona em sessão WSL:** terminal integrado, connectors e plugins,
fork de sessão, painel de arquivos, e sugestões de arquivo ao digitar `@` no composer.
Para essas funções, use uma sessão nativa (fora do WSL) ou o terminal do próprio WSL.

**Dispositivo gerenciado pela organização:** se a sessão WSL não iniciar com mensagem de
"dispositivo gerenciado", isso é controlado por política de administrador — não é um bug local.

### 1.2 Linux (ambiente padrão da equipe)

No Linux, o Claude Code roda nativamente, sem camada extra. Instale normalmente e abra o
projeto direto:

```bash
cd ~/projetos/frota-pf-snm
claude
```

Como o ambiente Linux é o "alvo real" do projeto, esse é o cenário sem nenhuma
particularidade — o mesmo comportamento que você terá dentro do WSL no Windows.

### 1.3 Regra prática para os dois ambientes

Peça para o próprio Claude Code fazer os commits em vez de rodar `git add`/`git commit` manualmente:

> "Commite tudo com uma mensagem descritiva."

Isso mantém o histórico de commits — que aqui também serve como trilha de auditoria do
desenvolvimento — consistente, independentemente de quem/onde rodou.

---

## 2. Rodando o projeto

### 2.1 Fase atual — protótipo estático

Por enquanto o projeto é só o protótipo HTML (`prototype/index.html`), sem backend.
Funciona igual em Windows e Linux, sem instalação de dependências:

```bash
# dentro do WSL ou Linux nativo
cd frota-pf-snm/prototype
python3 -m http.server 8080
# abra http://localhost:8080 no navegador
```

### 2.2 Fase seguinte — quando entrar o backend (Node + PostgreSQL/Neon)

Ainda a implementar, mas a instalação será a mesma em Linux e dentro do WSL (já que
ambos são Linux). No Windows nativo (fora do WSL) alguns passos mudam — por isso a
recomendação é sempre desenvolver dentro do WSL, mantendo paridade total com produção/CI,
que também roda em Linux.

Pré-requisitos previstos:
- Node.js LTS
- `DATABASE_URL` do Neon como variável de ambiente (nunca commitada — ver `.env.example`
  quando for criado, e `docs/SECURITY.md`)
- Cliente `psql` (opcional, para inspecionar o banco diretamente)

Este arquivo será atualizado assim que o backend for iniciado, com os comandos reais de
`install`, `dev` e `migrate`.
