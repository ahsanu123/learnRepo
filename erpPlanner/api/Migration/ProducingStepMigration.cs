using FluentMigrator;

namespace erpPlanner.pMigration;

/*public int Id { get; set; }*/
/*public int ProjectId { get; set; }*/
/*public string[] ListStep { get; set; }*/
public class ProducingStepMigration : MigrationChild
{
    public void ChildDown(Migration migration)
    {
        migration.DeleteTableIfExists("producingStep");
    }

    public void ChildUp(Migration migration)
    {
        migration.Create.Table("producingStep")
          .WithColumn("id").AsInt64().PrimaryKey().Identity()
          .WithColumn("liststep").AsString();

        migration.Create.ForeignKey("projectid")
          .FromTable("producingStep").ForeignColumn("projectid")
          .ToTable("project").PrimaryColumn("id");
    }
}
