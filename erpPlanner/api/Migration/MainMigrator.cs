using System.Reflection;
using FluentMigrator;
using FluentMigrator.Runner;

namespace erpPlanner.pMigration;

[Migration(MigrationExtension.MIGRATION_VERSION, MigrationExtension.MIGRATION_DESCRIPTION)]
public class MainMigrator : Migration
{
    /*IEnumerable<Migration?> ListMigration = typeof(Migration)*/
    /*  .Assembly.GetTypes()*/
    /*  .Where(type => type.IsSubclassOf(typeof(Migration)) && typeof(IMigrationExec).IsAssignableFrom(type) && !type.IsAbstract)*/
    /*  .Select(type => (Migration)Activator.CreateInstance(type));*/

    IEnumerable<Type> listMigration = Assembly.GetAssembly(typeof(MigrationChild))
      .GetTypes()
      .Where(type => type.IsClass && !type.IsAbstract && typeof(MigrationChild).IsAssignableFrom(type));

    List<MigrationChild> GetMigrationInheritedClass()
    {
        List<MigrationChild> list = new List<MigrationChild>();
        foreach (var item in listMigration)
        {
            if (System.Attribute.GetCustomAttributes(item).Length == 0)
            {
                list.Add((MigrationChild)Activator.CreateInstance(item));
            }
        }
        return list;
    }

    public override void Down()
    {
        foreach (var item in GetMigrationInheritedClass())
        {
            item.ChildDown(this);
        }
    }

    public override void Up()
    {
        foreach (var item in GetMigrationInheritedClass())
        {
            item.ChildUp(this);
        }
    }
}
