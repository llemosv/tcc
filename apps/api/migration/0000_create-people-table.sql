CREATE TABLE IF NOT EXISTS "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text,
	"email" varchar(255),
	"senha" text,
	"fl_ativo" boolean,
	"id_tipo_pessoa" integer NOT NULL,
	CONSTRAINT "people_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "person_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo" varchar(50) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "people" ADD CONSTRAINT "people_id_tipo_pessoa_person_types_id_fk" FOREIGN KEY ("id_tipo_pessoa") REFERENCES "public"."person_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
