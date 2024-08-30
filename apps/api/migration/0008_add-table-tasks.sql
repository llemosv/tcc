CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_tcc" integer NOT NULL,
	"tarefa" varchar(255) NOT NULL,
	"previsao_entrega" date NOT NULL,
	"data_criacao" date,
	"data_reprovacao" date
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_id_tcc_tcc_guidances_id_fk" FOREIGN KEY ("id_tcc") REFERENCES "public"."tcc_guidances"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
