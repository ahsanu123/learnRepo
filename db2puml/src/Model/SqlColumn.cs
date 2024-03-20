using System.Diagnostics;

namespace DB2PUML.Model;

[DebuggerDisplay("ColumnName = {ColumnName}, DataType = {DataType}")]
public class SqlColumn
{
    public bool IsPrimaryKey { get; set; }
    public bool IsForeignKey { get; set; }
    public string? ColumnName { get; set; }
    public string? IsNullable { get; set; }
    public string? DataType { get; set; }
}
