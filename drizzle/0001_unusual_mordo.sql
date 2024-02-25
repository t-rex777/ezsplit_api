ALTER TABLE "expenses_to_users" DROP CONSTRAINT "expenses_to_users_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_expenses" DROP CONSTRAINT "user_expenses_category_id_categories_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "expenses_to_users" ADD CONSTRAINT "expenses_to_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_expenses" ADD CONSTRAINT "user_expenses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
