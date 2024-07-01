using System.Reflection;
using erpPlanner.Model;
using FluentMigrator;

namespace erpPlanner.pMigration;

[Migration(MigrationExtension.MIGRATION_VERSION, MigrationExtension.MIGRATION_DESCRIPTION)]
public class MainMigrator : Migration
{
    /// <summary>
    ///
    /// Scan All MigrationChild in assembly, and create instance of it
    /// then run childUp or childDown inside MainMigrator Up and Down Method
    ///
    /// </summary>
    IEnumerable<Type> listMigration = Assembly
        .GetAssembly(typeof(MigrationChild))
        .GetTypes()
        .Where(type =>
            type.IsClass && !type.IsAbstract && typeof(MigrationChild).IsAssignableFrom(type)
        );

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
