CREATE TYPE "public"."perfil_usuario" AS ENUM('admin', 'gestor', 'motorista');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid,
	"acao" varchar(100) NOT NULL,
	"entidade" varchar(100) NOT NULL,
	"entidade_id" varchar(100),
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matricula" varchar(50) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"perfil" "perfil_usuario" DEFAULT 'motorista' NOT NULL,
	"lotacao" varchar(100) NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usuarios_matricula_unique" UNIQUE("matricula")
);
--> statement-breakpoint
CREATE TABLE "veiculos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"placa" varchar(10) NOT NULL,
	"modelo" varchar(255) NOT NULL,
	"lotacao" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'disponivel' NOT NULL,
	"km_atual" integer DEFAULT 0 NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "veiculos_placa_unique" UNIQUE("placa")
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;