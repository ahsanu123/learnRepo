using Dapper;
using System.Data.SqlClient;

using DB2PUML.Model;
using Spectre.Console;

namespace DB2PUML.Service;

public interface IGenerateTables
{
    public List<SqlTable> Execute(ref ProgressTask progress, List<string> tablesToInclude = null, List<string> tablesToExclude = null);

    public void GetForeignKeyConstraint(SqlTable table);
    public void GetTableColumns(SqlTable table);
    public void GetTablePrimaryKeys(SqlTable table);
    public void GetTableForeignKeys(SqlTable table);
}

public class GenerateSqlServerTables : IGenerateTables
{
    private string _connString;

    public GenerateSqlServerTables(string dbConnString)
    {
        _connString = dbConnString;
    }

    public List<SqlTable> Execute(
        ref ProgressTask progress,
        List<string> tablesToInclude = null,
        List<string> tablesToExclude = null)
    {
        using (var sqlConn = new SqlConnection(_connString))
        {
            var sql = @"SELECT 
                        schema_id, 
                        SCHEMA_NAME(schema_id) as [schemaName],
                        name as tableName,
                        object_id as objectId,
                        '['+SCHEMA_NAME(schema_id)+'].['+name+']' AS fullName 
                        FROM sys.tables where is_ms_shipped = 0";
            var tableList = sqlConn.Query<SqlTable>(sql).ToList();
            progress.Increment(5);

            float increment = 95;
            increment /= (float)tableList.Count;

            foreach (var table in tableList)
            {
                progress.Description = $"Generating Table {table.TableName} ";
                if (tablesToExclude != null && tablesToExclude.Contains(table.FullName))
                    continue;

                if (tablesToInclude != null && !tablesToInclude.Contains(table.FullName))
                    continue;

                GetTableColumns(table);
                GetTablePrimaryKeys(table);
                GetTableForeignKeys(table);
                GetForeignKeyConstraint(table);
                progress.Increment(increment);
            }

            return tableList;
        }
    }

    public void GetForeignKeyConstraint(SqlTable table)
    {

        using (var sqlConn = new SqlConnection(_connString))
        {
            var sql = $@"
                        SELECT 
                          object_id as objectId,
                          parent_object_id as parentObjectId,
                          OBJECT_SCHEMA_NAME(parent_object_id) as [FkSchemaName],
                          OBJECT_NAME(parent_object_id) AS [FkTableName],
                          name AS [foreignKeyName],
                          OBJECT_SCHEMA_NAME(referenced_object_id) as [pkSchemaName],
                          OBJECT_NAME(referenced_object_id) AS [pkTableName]
                        FROM sys.foreign_keys
                        WHERE parent_object_id = OBJECT_ID('{table.FullName}')";

            table.ForeignKeyList = sqlConn.Query<ForeignKeyConstraint>(sql).ToList();
        }
    }

    public void GetTableForeignKeys(SqlTable table)
    {
        using (var sqlConn = new SqlConnection(_connString))
        {
            var sql = $@"
                    SELECT KU.table_name as tableName
                        ,column_name as foreignKeyColumn 
                    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC 
                    INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KU
                        ON TC.CONSTRAINT_TYPE = 'FOREIGN KEY' 
                        AND TC.CONSTRAINT_NAME = KU.CONSTRAINT_NAME 
                        AND KU.table_name='{table.TableName}'
                      AND KU.TABLE_SCHEMA = '{table.SchemaName}'
                    ORDER BY 
                        KU.TABLE_NAME
                        ,KU.ORDINAL_POSITION";

            var foreighnKeyList = sqlConn.Query<ForeignKey>(sql).ToList();

            foreach (var row in foreighnKeyList)
            {
                var col = table.ColumnList.Where(x => x.ColumnName == row.ForeignKeyColumn).FirstOrDefault();
                if (col != null)
                {
                    col.IsForeignKey = true;
                }
            }
        }
    }

    public void GetTablePrimaryKeys(SqlTable table)
    {

        using (var sqlConn = new SqlConnection(_connString))
        {
            var sql = $@"
                          SELECT KU.table_name as tableName
                              ,column_name as primaryKeyColumn
                          FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC 
                          INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KU
                              ON TC.CONSTRAINT_TYPE = 'PRIMARY KEY' 
                              AND TC.CONSTRAINT_NAME = KU.CONSTRAINT_NAME 
                              AND KU.table_name='{table.TableName}'
                            AND KU.TABLE_SCHEMA = '{table.SchemaName}'
                          ORDER BY 
                              KU.TABLE_NAME
                              ,KU.ORDINAL_POSITION";

            var primaryKeyList = sqlConn.Query<PrimaryKey>(sql).ToList();

            foreach (var row in primaryKeyList)
            {
                var col = table.ColumnList.Where(x => x.ColumnName == row.PrimaryKeyColumn).FirstOrDefault();
                if (col != null)
                {
                    col.IsPrimaryKey = true;
                }
            }
        }
    }

    public void GetTableColumns(SqlTable table)
    {

        using (var sqlConn = new SqlConnection(_connString))
        {
            var sql = $@"
                  select COLUMN_NAME as columnName, 
                  IS_NULLABLE as isNullable,
                  DATA_TYPE as dataType
                  from 
                  INFORMATION_SCHEMA.COLUMNS 
                  where TABLE_SCHEMA = '{table.SchemaName}' 
                  and TABLE_NAME = '{table.TableName}' 
                  order by ORDINAL_POSITION";

            var columnList = sqlConn.Query<SqlColumn>(sql).ToList();

            table.ColumnList = columnList;
        }
    }
}
