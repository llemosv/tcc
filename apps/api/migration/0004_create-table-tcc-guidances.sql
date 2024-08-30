CREATE TABLE IF NOT EXISTS "tcc_guidances" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_aluno_solicitante" integer NOT NULL,
	"id_professor_orientador" integer NOT NULL,
	"solicitacao_aceita" boolean NOT NULL,
	"nome_projeto" varchar(255) NOT NULL,
	"justificativa" text,
	"data_aprovacao" date,
	"data_reprovacao" date
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tcc_guidances" ADD CONSTRAINT "tcc_guidances_id_aluno_solicitante_people_id_fk" FOREIGN KEY ("id_aluno_solicitante") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tcc_guidances" ADD CONSTRAINT "tcc_guidances_id_professor_orientador_people_id_fk" FOREIGN KEY ("id_professor_orientador") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
