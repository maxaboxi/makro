CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);


DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "Users" (
        "Id" serial NOT NULL,
        "UUID" text NOT NULL,
        "Username" text NOT NULL,
        "Password" text NULL,
        "Email" text NULL,
        "Age" integer NOT NULL,
        "Height" numeric NOT NULL,
        "Weight" numeric NOT NULL,
        "Activity" numeric NOT NULL,
        "Sex" text NULL,
        "DailyExpenditure" numeric NOT NULL,
        "UserAddedExpenditure" numeric NOT NULL,
        "UserAddedProteinTarget" numeric NOT NULL,
        "UserAddedCarbTarget" numeric NOT NULL,
        "UserAddedFatTarget" numeric NOT NULL,
        "LastLogin" timestamp without time zone NOT NULL,
        "Roles" text[] NULL,
        "ShowTargets" boolean NOT NULL,
        "Lang" text NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone NOT NULL,
        CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "Days" (
        "Id" serial NOT NULL,
        "UUID" text NOT NULL,
        "UserId" integer NOT NULL,
        "Name" text NOT NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone NOT NULL,
        CONSTRAINT "PK_Days" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Days_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "Feedbacks" (
        "Id" serial NOT NULL,
        "UUID" text NOT NULL,
        "UserId" integer NOT NULL,
        "FeedbackBody" text NOT NULL,
        "Answer" text NULL,
        "Anonymous" boolean NOT NULL,
        "AnsweredById" integer NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone NOT NULL,
        "AnsweredAt" timestamp without time zone NOT NULL,
        CONSTRAINT "PK_Feedbacks" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Feedbacks_Users_AnsweredById" FOREIGN KEY ("AnsweredById") REFERENCES "Users" ("Id") ON DELETE RESTRICT,
        CONSTRAINT "FK_Feedbacks_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "Foods" (
        "Id" serial NOT NULL,
        "UUID" text NOT NULL,
        "UserId" integer NOT NULL,
        "Name" text NOT NULL,
        "Energy" numeric NOT NULL,
        "Protein" numeric NOT NULL,
        "Carbs" numeric NOT NULL,
        "Fat" numeric NOT NULL,
        "Sugar" numeric NOT NULL,
        "Fiber" numeric NOT NULL,
        "PackageSize" numeric NOT NULL,
        "ServingSize" numeric NOT NULL,
        "En" text NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone NOT NULL,
        CONSTRAINT "PK_Foods" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Foods_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "MealNames" (
        "Id" serial NOT NULL,
        "UUID" text NOT NULL,
        "UserId" integer NOT NULL,
        "Name" text NOT NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone NOT NULL,
        CONSTRAINT "PK_MealNames" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_MealNames_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "SharedDays" (
        "Id" serial NOT NULL,
        "UUID" text NOT NULL,
        "UserId" integer NOT NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone NOT NULL,
        CONSTRAINT "PK_SharedDays" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_SharedDays_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "SharedMeals" (
        "Id" serial NOT NULL,
        "UUID" text NOT NULL,
        "UserId" integer NOT NULL,
        "Name" text NOT NULL,
        "Info" text NULL,
        "Recipe" text NULL,
        "Tags" text[] NOT NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone NOT NULL,
        CONSTRAINT "PK_SharedMeals" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_SharedMeals_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "Meals" (
        "Id" serial NOT NULL,
        "UUID" text NOT NULL,
        "Name" text NOT NULL,
        "UserId" integer NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone NOT NULL,
        "DayId" integer NULL,
        "SharedDayId" integer NULL,
        CONSTRAINT "PK_Meals" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Meals_Days_DayId" FOREIGN KEY ("DayId") REFERENCES "Days" ("Id") ON DELETE RESTRICT,
        CONSTRAINT "FK_Meals_SharedDays_SharedDayId" FOREIGN KEY ("SharedDayId") REFERENCES "SharedDays" ("Id") ON DELETE RESTRICT,
        CONSTRAINT "FK_Meals_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "Likes" (
        "Id" serial NOT NULL,
        "UUID" text NOT NULL,
        "UserId" integer NOT NULL,
        "Value" integer NOT NULL,
        "SharedMealId" integer NULL,
        "CreatedAt" timestamp without time zone NOT NULL,
        "UpdatedAt" timestamp without time zone NOT NULL,
        CONSTRAINT "PK_Likes" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Likes_SharedMeals_SharedMealId" FOREIGN KEY ("SharedMealId") REFERENCES "SharedMeals" ("Id") ON DELETE RESTRICT,
        CONSTRAINT "FK_Likes_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "SharedMealFoods" (
        "Id" serial NOT NULL,
        "FoodId" integer NOT NULL,
        "SharedMealId" integer NOT NULL,
        "FoodAmount" numeric NOT NULL,
        CONSTRAINT "PK_SharedMealFoods" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_SharedMealFoods_Foods_FoodId" FOREIGN KEY ("FoodId") REFERENCES "Foods" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_SharedMealFoods_SharedMeals_SharedMealId" FOREIGN KEY ("SharedMealId") REFERENCES "SharedMeals" ("Id") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE TABLE "MealFoods" (
        "Id" serial NOT NULL,
        "MealId" integer NOT NULL,
        "FoodId" integer NOT NULL,
        "FoodAmount" numeric NOT NULL,
        CONSTRAINT "PK_MealFoods" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_MealFoods_Foods_FoodId" FOREIGN KEY ("FoodId") REFERENCES "Foods" ("Id") ON DELETE CASCADE,
        CONSTRAINT "FK_MealFoods_Meals_MealId" FOREIGN KEY ("MealId") REFERENCES "Meals" ("Id") ON DELETE CASCADE
    );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_Days_UserId" ON "Days" ("UserId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_Feedbacks_AnsweredById" ON "Feedbacks" ("AnsweredById");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE UNIQUE INDEX "IX_Feedbacks_UUID" ON "Feedbacks" ("UUID");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_Feedbacks_UserId" ON "Feedbacks" ("UserId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE UNIQUE INDEX "IX_Foods_UUID" ON "Foods" ("UUID");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_Foods_UserId" ON "Foods" ("UserId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_Likes_SharedMealId" ON "Likes" ("SharedMealId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE UNIQUE INDEX "IX_Likes_UUID" ON "Likes" ("UUID");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_Likes_UserId" ON "Likes" ("UserId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_MealFoods_FoodId" ON "MealFoods" ("FoodId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_MealFoods_MealId" ON "MealFoods" ("MealId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE UNIQUE INDEX "IX_MealNames_UUID" ON "MealNames" ("UUID");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_MealNames_UserId" ON "MealNames" ("UserId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_Meals_DayId" ON "Meals" ("DayId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_Meals_SharedDayId" ON "Meals" ("SharedDayId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE UNIQUE INDEX "IX_Meals_UUID" ON "Meals" ("UUID");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_Meals_UserId" ON "Meals" ("UserId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE UNIQUE INDEX "IX_SharedDays_UUID" ON "SharedDays" ("UUID");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_SharedDays_UserId" ON "SharedDays" ("UserId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_SharedMealFoods_FoodId" ON "SharedMealFoods" ("FoodId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_SharedMealFoods_SharedMealId" ON "SharedMealFoods" ("SharedMealId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE UNIQUE INDEX "IX_SharedMeals_UUID" ON "SharedMeals" ("UUID");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE INDEX "IX_SharedMeals_UserId" ON "SharedMeals" ("UserId");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE UNIQUE INDEX "IX_Users_Email" ON "Users" ("Email");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE UNIQUE INDEX "IX_Users_UUID" ON "Users" ("UUID");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    CREATE UNIQUE INDEX "IX_Users_Username" ON "Users" ("Username");
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20190313053129_InitialMigration') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20190313053129_InitialMigration', '2.2.1-servicing-10028');
    END IF;
END $$;
