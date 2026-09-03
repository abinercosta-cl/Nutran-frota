CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL,
	"expira_em" timestamp NOT NULL,
	"revogado" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "senha_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;