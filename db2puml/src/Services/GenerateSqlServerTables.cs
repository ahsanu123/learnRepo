﻿using Dapper;
using System.Data.SqlClient;

using DB2PUML.Model;

namespace DB2PUML.Service;


public class GenerateSqlServerTables : IGenerateTables
{
    private SqlConnection m_sqlConn;
    private List<SqlTable> m_tableList = new List<SqlTable>();
    private string m_database;

    public GenerateSqlServerTables(string dbConnString)
    {
        m_sqlConn = new SqlConnection(dbConnString);
    }

    public List<SqlTable> Execute(List<string> tablesToInclude = null, List<string> tablesToExclude = null)
    {
        m_tableList = new List<SqlTable>();

        try
        {
            var sql = @"SELECT 
              schema_id, 
              SCHEMA_NAME(schema_id) as [schema_name],
              name as table_name,
              object_id,
              '['+SCHEMA_NAME(schema_id)+'].['+name+']' AS full_name 
                FROM sys.tables where is_ms_shipped = 0";
            dynamic list = m_sqlConn.Query<dynamic>(sql);

            foreach (var row in list)
            {
                try
                {
                    var fullName = $"{row.schema_name}.{row.table_name}";
                    Console.WriteLine("List From database" + fullName); ;
                    if (tablesToExclude != null && tablesToExclude.Contains(fullName))
                        continue;

                    if (tablesToInclude != null && !tablesToInclude.Contains(fullName))
                        continue;

                    Console.WriteLine($"[{row.schema_name}].[{row.table_name}]");

                    var table = new SqlTable();
                    table.SchemaId = row.schema_id;
                    table.SchemaName = row.schema_name;
                    table.TableName = row.table_name;
                    table.ObjectId = row.object_id;
                    table.FullName = row.full_name;

                    GetTableColumns(table);
                    GetTablePrimaryKeys(table);
                    GetTableForeignKeys(table);
                    GetForeignKeyConstraint(table);

                    m_tableList.Add(table);
                }
                catch (Exception ex)
                {
                }
            }
        }
        catch (Exception ex)
        {
        }

        return m_tableList;
    }

    public void GetForeignKeyConstraint(SqlTable table)
    {
        var sql = $@"SELECT 
                object_id,parent_object_id,
                  OBJECT_SCHEMA_NAME(parent_object_id) as [fk_schema_name],
                  OBJECT_NAME(parent_object_id) AS [fk_table_name],
                  name AS [foreign_key_name],
                  OBJECT_SCHEMA_NAME(referenced_object_id) as [pk_schema_name],
                  OBJECT_NAME(referenced_object_id) AS [pk_table_name]
                FROM sys.foreign_keys
                WHERE parent_object_id = OBJECT_ID('{table.FullName}')";

        table.ForeignKeyList = m_sqlConn.Query<ForeignKeyConstraint>(sql).ToList();
        //table.foreign_key_list = list;
        //foreach (var row in list)
        //{
        //    var obj = new ForeignKeyConstraint();
        //    obj.object_id = row.object_id;
        //    obj.parent_object_id = row.parent_object_id;
        //    obj.fk_schema_name = row.fk_schema;
        //    obj.fk_table_name = row.fk_Table;
        //    obj.foreign_key_name = row.foreign_key;
        //    obj.pk_schema_name = row.pk_schema;
        //    obj.pk_table_name = row.pk_table;

        //    table.foreign_key_list.Add(obj);
        //}
    }

    public void GetTableForeignKeys(SqlTable table)
    {
        var sql = $@"SELECT KU.table_name as table_name
                    ,column_name as foreign_key_column
                FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC 
                INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KU
                    ON TC.CONSTRAINT_TYPE = 'FOREIGN KEY' 
                    AND TC.CONSTRAINT_NAME = KU.CONSTRAINT_NAME 
                    AND KU.table_name='{table.TableName}'
	                AND KU.TABLE_SCHEMA = '{table.SchemaName}'
                ORDER BY 
                     KU.TABLE_NAME
                    ,KU.ORDINAL_POSITION";

        dynamic foreighnKeyList = m_sqlConn.Query<dynamic>(sql);

        foreach (var row in foreighnKeyList)
        {
            var col = table.ColumnList.Where(x => x.ColumnName == row.foreign_key_column).FirstOrDefault();
            if (col != null)
            {
                col.IsForeignKey = true;
            }
        }
    }

    public void GetTablePrimaryKeys(SqlTable table)
    {
        var sql = $@"SELECT KU.table_name as table_name
                    ,column_name as primary_key_column
                FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC 
                INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KU
                    ON TC.CONSTRAINT_TYPE = 'PRIMARY KEY' 
                    AND TC.CONSTRAINT_NAME = KU.CONSTRAINT_NAME 
                    AND KU.table_name='{table.TableName}'
	                AND KU.TABLE_SCHEMA = '{table.SchemaName}'
                ORDER BY 
                     KU.TABLE_NAME
                    ,KU.ORDINAL_POSITION";

        dynamic primaryKeyList = m_sqlConn.Query<dynamic>(sql);

        foreach (var row in primaryKeyList)
        {
            var col = table.ColumnList.Where(x => x.ColumnName == row.primary_key_column).FirstOrDefault();
            if (col != null)
            {
                col.IsPrimaryKey = true;
            }
        }
    }

    public void GetTableColumns(SqlTable table)
    {
        var sql = $@"
                  select COLUMN_NAME, 
                  IS_NULLABLE,
                  DATA_TYPE
                  from 
                  INFORMATION_SCHEMA.COLUMNS 
                  where TABLE_SCHEMA = '{table.SchemaName}' 
                  and TABLE_NAME = '{table.TableName}' 
                  order by ORDINAL_POSITION";

        dynamic columnList = m_sqlConn.Query<dynamic>(sql);

        foreach (var row in columnList)
        {
            var c = new SqlColumn();
            c.ColumnName = row.COLUMN_NAME;
            c.IsNullable = row.IS_NULLABLE;
            c.DataType = row.DATA_TYPE;

            table.ColumnList.Add(c);
        }
    }
}