CREATE TABLE IF NOT EXISTS "planerp_material" (
    "material_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(50) NULL DEFAULT NULL,
    "category" VARCHAR(50) NULL DEFAULT NULL,
    "description" VARCHAR(2000) NULL DEFAULT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "suplier" VARCHAR(100) NOT NULL,
    "suplier_link" VARCHAR(1000) NULL DEFAULT NULL,
    "storage_id" INTEGER NOT NULL,
    PRIMARY KEY ("material_id"),
    CONSTRAINT "fk_project_id" FOREIGN KEY (
        "project_id"
    ) REFERENCES "planerp_project" (
        "project_id"
    ) ON UPDATE NO ACTION ON DELETE SET NULL,
    CONSTRAINT "fk_storage_id" FOREIGN KEY (
        "storage_id"
    ) REFERENCES "planerp_storage" (
        "storage_id"
    ) ON UPDATE NO ACTION ON DELETE SET NULL
);
