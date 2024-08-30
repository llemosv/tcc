ALTER TABLE "user_courses" RENAME TO "people_courses";--> statement-breakpoint
ALTER TABLE "person_types" RENAME TO "people_types";--> statement-breakpoint
ALTER TABLE "people" DROP CONSTRAINT "people_id_tipo_pessoa_person_types_id_fk";
--> statement-breakpoint
ALTER TABLE "people_courses" DROP CONSTRAINT "user_courses_people_id_people_id_fk";
--> statement-breakpoint
ALTER TABLE "people_courses" DROP CONSTRAINT "user_courses_course_id_courses_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "people" ADD CONSTRAINT "people_id_tipo_pessoa_people_types_id_fk" FOREIGN KEY ("id_tipo_pessoa") REFERENCES "public"."people_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "people_courses" ADD CONSTRAINT "people_courses_people_id_people_id_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "people_courses" ADD CONSTRAINT "people_courses_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
