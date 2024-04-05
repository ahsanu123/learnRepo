
using DB2PUML.Model;
using Spectre.Console;

namespace DB2PUML.Service;

public class GeneratePostgresqlTables : IGenerateTables
{
    public List<SqlTable> Execute(ref ProgressTask progress, List<string> tablesToInclude = null, List<string> tablesToExclude = null)
    {
        throw new NotImplementedException();
    }

    public void GetForeignKeyConstraint(SqlTable table)
    {
        throw new NotImplementedException();
    }

    public void GetTableColumns(SqlTable table)
    {
        throw new NotImplementedException();
    }

    public void GetTableForeignKeys(SqlTable table)
    {
        throw new NotImplementedException();
    }

    public void GetTablePrimaryKeys(SqlTable table)
    {
        throw new NotImplementedException();
    }
}
