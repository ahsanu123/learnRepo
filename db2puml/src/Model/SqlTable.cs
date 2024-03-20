using System.Diagnostics;

namespace DB2PUML.Model;

[DebuggerDisplay("Schema = {SchemaName}, TableName = {TableName}")]
public class SqlTable
{
    public int SchemaId { get; set; }
    public int ObjectId { get; set; }
    public string? SchemaName { get; set; }
    public string? TableName { get; set; }
    public string? FullName { get; set; }

    public List<SqlColumn> ColumnList { get; set; } = new List<SqlColumn>();
    public List<ForeignKeyConstraint> ForeignKeyList { get; set; } = new List<ForeignKeyConstraint>();
}
