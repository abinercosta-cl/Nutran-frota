-- Imutabilidade da tabela audit_log (FROTA PF SNM)
-- Rejeita qualquer tentativa de UPDATE ou DELETE disparando uma exceção no PostgreSQL

CREATE OR REPLACE FUNCTION audit_log_immutable()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Operação não permitida: registros em audit_log são estritamente imutáveis (apenas INSERT é permitido).'
    USING ERRCODE = 'restrict_violation',
          HINT = 'A tabela audit_log armazena a trilha de auditoria e não aceita modificação ou exclusão.';
END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint

CREATE TRIGGER trg_audit_log_immutable
BEFORE UPDATE OR DELETE ON "audit_log"
FOR EACH ROW
EXECUTE FUNCTION audit_log_immutable();