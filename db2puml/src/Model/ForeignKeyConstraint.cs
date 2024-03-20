using System.Diagnostics;

namespace DB2PUML.Model;

[DebuggerDisplay("FK = {ForeignKeyName}")]
public class ForeignKeyConstraint
{
    public int ObjectId { get; set; }
    public int ParentObjectID { get; set; }
    public string? FkSchemaName { get; set; }
    public string? FkTableName { get; set; }
    public string? ForeignKeyName { get; set; }
    public string? PkSchemaName { get; set; }
    public string? PkTableName { get; set; }
}
