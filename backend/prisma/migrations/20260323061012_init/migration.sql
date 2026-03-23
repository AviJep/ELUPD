-- CreateTable
CREATE TABLE "lgu_directory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "region" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city_municipality" TEXT NOT NULL,
    "lgu_type" TEXT NOT NULL,
    "income_class" TEXT NOT NULL,
    "geo_json_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "clup_progress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lgu_id" INTEGER NOT NULL,
    "clup_status" TEXT NOT NULL,
    "current_phase" TEXT NOT NULL,
    CONSTRAINT "clup_progress_lgu_id_fkey" FOREIGN KEY ("lgu_id") REFERENCES "lgu_directory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pdpfp_status" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lgu_id" INTEGER NOT NULL,
    "latest_status" TEXT NOT NULL,
    "date_of_approval" DATETIME,
    "year_adopted" INTEGER,
    "year_approved" INTEGER,
    "end_year" INTEGER,
    CONSTRAINT "pdpfp_status_lgu_id_fkey" FOREIGN KEY ("lgu_id") REFERENCES "lgu_directory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "housing_projects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lgu_id" INTEGER NOT NULL,
    "project_name" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "project_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "housing_projects_lgu_id_fkey" FOREIGN KEY ("lgu_id") REFERENCES "lgu_directory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "lgu_directory_city_municipality_key" ON "lgu_directory"("city_municipality");

-- CreateIndex
CREATE UNIQUE INDEX "clup_progress_lgu_id_key" ON "clup_progress"("lgu_id");

-- CreateIndex
CREATE UNIQUE INDEX "pdpfp_status_lgu_id_key" ON "pdpfp_status"("lgu_id");
