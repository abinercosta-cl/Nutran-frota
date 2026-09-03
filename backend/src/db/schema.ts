import { pgTable, uuid, varchar, text, boolean, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const perfilEnum = pgEnum('perfil_usuario', ['admin', 'gestor', 'motorista']);

export const usuarios = pgTable('usuarios', {
  id: uuid('id').defaultRandom().primaryKey(),
  matricula: varchar('matricula', { length: 50 }).notNull().unique(),
  nome: varchar('nome', { length: 255 }).notNull(),
  senhaHash: text('senha_hash').notNull(),
  perfil: perfilEnum('perfil').notNull().default('motorista'),
  lotacao: varchar('lotacao', { length: 100 }).notNull(),
  ativo: boolean('ativo').default(true).notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});

export const veiculos = pgTable('veiculos', {
  id: uuid('id').defaultRandom().primaryKey(),
  placa: varchar('placa', { length: 10 }).notNull().unique(),
  modelo: varchar('modelo', { length: 255 }).notNull(),
  lotacao: varchar('lotacao', { length: 100 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('disponivel'),
  kmAtual: integer('km_atual').notNull().default(0),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});

export const auditLog = pgTable('audit_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id),
  acao: varchar('acao', { length: 100 }).notNull(),
  entidade: varchar('entidade', { length: 100 }).notNull(),
  entidadeId: varchar('entidade_id', { length: 100 }),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  usuarioId: uuid('usuario_id').references(() => usuarios.id).notNull(),
  tokenHash: text('token_hash').notNull(),
  criadoEm: timestamp('criado_em').defaultNow().notNull(),
  expiraEm: timestamp('expira_em').notNull(),
  revogado: boolean('revogado').default(false).notNull(),
});

export type Usuario = InferSelectModel<typeof usuarios>;
export type NewUsuario = InferInsertModel<typeof usuarios>;

export type Veiculo = InferSelectModel<typeof veiculos>;
export type NewVeiculo = InferInsertModel<typeof veiculos>;

export type AuditLog = InferSelectModel<typeof auditLog>;
export type NewAuditLog = InferInsertModel<typeof auditLog>;

export type RefreshToken = InferSelectModel<typeof refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;

