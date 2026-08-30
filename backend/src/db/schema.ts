import { pgTable, uuid, varchar, boolean, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const perfilEnum = pgEnum('perfil_usuario', ['admin', 'gestor', 'motorista']);

export const usuarios = pgTable('usuarios', {
  id: uuid('id').defaultRandom().primaryKey(),
  matricula: varchar('matricula', { length: 50 }).notNull().unique(),
  nome: varchar('nome', { length: 255 }).notNull(),
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

export type Usuario = InferSelectModel<typeof usuarios>;
export type NewUsuario = InferInsertModel<typeof usuarios>;

export type Veiculo = InferSelectModel<typeof veiculos>;
export type NewVeiculo = InferInsertModel<typeof veiculos>;

export type AuditLog = InferSelectModel<typeof auditLog>;
export type NewAuditLog = InferInsertModel<typeof auditLog>;
