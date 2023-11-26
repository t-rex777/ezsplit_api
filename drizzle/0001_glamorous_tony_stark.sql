ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dob" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;