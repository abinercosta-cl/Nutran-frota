# FROTA PF — SNM

Sistema de controle de frota veicular — Polícia Federal (Superintendência SNM).

## Status
Protótipo de interface (fase 1). Estrutura de dados e backend ainda não implementados.

## Estrutura do repositório
```
prototype/    -> protótipo HTML navegável (front-end estático, dados mockados)
docs/         -> arquitetura, modelo de dados (PostgreSQL/Neon) e notas de segurança
```

## Módulos previstos
- Veículos (cadastro e status da frota)
- Registrar Saída VT (check-out/check-in com cadeia de custódia)
- Veículos em Oficina
- Ordens de Serviço
- Alertas (documentação, manutenção preventiva, km excedido)
- Cautelas — VT (responsabilidade sobre a viatura)
- Pedir Manutenção (fila de aprovação)
- Usuários (RBAC: admin / gestor / motorista)
- Pedir Saldo (combustível/manutenção)

## Stack planejada
- Banco de dados: PostgreSQL via Neon
- Autenticação: sessão + MFA, RBAC no banco (Row Level Security por unidade/lotação)
- Auditoria: tabela `audit_log` append-only (sem UPDATE/DELETE) + triggers
- Front-end: a definir (React/Next.js sugerido para evoluir o protótipo atual)
- Acesso: responsivo, uso em desktop e mobile

## Histórico de decisões
Ver commits — cada etapa do desenvolvimento é registrada individualmente para manter rastreabilidade (auditoria do próprio processo de construção do sistema).
