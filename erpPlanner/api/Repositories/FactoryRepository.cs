using erpPlanner.Services;

namespace erpPlanner.Repository;

public interface IFactoryRepository
{
    public Task GenerateInitialTable();
    public Task GenerateInitialTableData();
    public Task ImportTableData();
    public Task ExportTableData();
}

public class FactoryRepository : IFactoryRepository
{
    private readonly PostgresqlConnectionProvider _connection;

    public FactoryRepository(PostgresqlConnectionProvider connection)
    {
        _connection = connection;
    }

    public Task GenerateInitialTable()
    {
        string materialTable = """
          CREATE TABLE IF NOT EXISTS public.planerp_material
          (
              materialid integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
              name character varying(100) COLLATE pg_catalog."default" NOT NULL,
              type character varying(50) COLLATE pg_catalog."default",
              category character varying(50) COLLATE pg_catalog."default",
              description character varying(2000) COLLATE pg_catalog."default",
              price double precision NOT NULL,
              suplier character varying(100) COLLATE pg_catalog."default" NOT NULL,
              suplierlink character varying(1000) COLLATE pg_catalog."default",
              storageid integer NOT NULL,
              active boolean NOT NULL DEFAULT false,
              CONSTRAINT planerp_material_pkey PRIMARY KEY (materialid),
              CONSTRAINT fk_storage_id FOREIGN KEY (storageid)
                  REFERENCES public.planerp_storage (storageid) MATCH SIMPLE
                  ON UPDATE NO ACTION
                  ON DELETE SET NULL
          )

          TABLESPACE pg_default;

          ALTER TABLE IF EXISTS public.planerp_material
              OWNER to alarm;
          """;

        string projectTable = """
          CREATE TABLE IF NOT EXISTS public.planerp_project
          (
              projectid integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
              name character varying(100) COLLATE pg_catalog."default" NOT NULL,
              createddate date NOT NULL DEFAULT CURRENT_DATE,
              deadlinedate date,
              lastupdateddate date NOT NULL DEFAULT CURRENT_DATE,
              finisheddate date,
              sellprice double precision,
              capital double precision NOT NULL,
              fail boolean NOT NULL DEFAULT false,
              finish boolean NOT NULL DEFAULT false,
              profitinpersen double precision,
              description character varying(2000) COLLATE pg_catalog."default",
              CONSTRAINT planerp_project_pkey PRIMARY KEY (projectid)
          )

          TABLESPACE pg_default;

          ALTER TABLE IF EXISTS public.planerp_project
              OWNER to alarm;
          """;
        throw new NotImplementedException();
    }

    public Task GenerateInitialTableData()
    {
        throw new NotImplementedException();
    }

    public Task ExportTableData()
    {
        throw new NotImplementedException();
    }

    public Task ImportTableData()
    {
        throw new NotImplementedException();
    }
}
