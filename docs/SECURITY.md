# Notas de segurança — FROTA PF SNM

Sistema de uso interno da Polícia Federal. Requisitos mínimos a manter em todas as fases:

1. **Autenticação**
   - Sessões de curta duração + MFA obrigatório para perfis Gestor/Admin.
   - Sem credenciais hardcoded em nenhum momento do código ou de commits.

2. **Autorização (RBAC)**
   - Perfis: `admin`, `gestor`, `motorista`.
   - Regras de acesso aplicadas no banco (Row Level Security no Postgres), não apenas no front-end.
   - Segregação por unidade/lotação (um gestor da SNM não deve visualizar dados de outra superintendência, salvo permissão explícita).

3. **Auditoria**
   - Tabela `audit_log` estritamente somente-leitura após escrita (apenas INSERT permitido).
   - **Garantia no Banco (PostgreSQL):** Protegida ativamente por trigger (`trg_audit_log_immutable`) e função (`audit_log_immutable()`) que abortam qualquer tentativa de `UPDATE` ou `DELETE` com `RAISE EXCEPTION`.
   - Contém: usuário, ação, timestamp, IP, entidade afetada.
   - Toda ação sensível (saída de viatura, aprovação de saldo, alteração de usuário) gera registro de auditoria.
   - Commits neste repositório também servem como trilha de auditoria do desenvolvimento — mensagens de commit devem ser descritivas.

4. **Dados sensíveis**
   - Dados em repouso (placas, matrículas, dados de condutores) criptografados no banco.
   - Nenhum dado real de servidores, viaturas ou operações deve ser commitado nos arquivos de exemplo/mock — usar apenas dados fictícios.
   - Variáveis de conexão (string do Neon, chaves de API) sempre via variáveis de ambiente / secrets manager — nunca em texto puro no repositório.

5. **Transporte**
   - HTTPS/TLS obrigatório em todas as camadas.

6. **Repositório**
   - `.gitignore` cobre arquivos de ambiente (`.env`) e artefatos locais.
   - Recomenda-se repositório **privado** no GitHub, com acesso restrito à equipe do projeto.
