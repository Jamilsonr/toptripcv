CREATE TABLE IF NOT EXISTS "UserPreference" (
	"userId" uuid PRIMARY KEY NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"preferences" json NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

