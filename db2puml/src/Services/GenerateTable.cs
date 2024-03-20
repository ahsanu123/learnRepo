using DB2PUML.Model;

namespace DB2PUML.Service;

public interface IGenerateTables
{
    public List<SqlTable> Execute(List<string> tablesToInclude = null, List<string> tablesToExclude = null);

    public void GetForeignKeyConstraint(SqlTable table);
    public void GetTableColumns(SqlTable table);
    public void GetTablePrimaryKeys(SqlTable table);
    public void GetTableForeignKeys(SqlTable table);
}
