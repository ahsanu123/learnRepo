using System.Text;
using DB2PUML.Model;
using DB2PUML.Shared;

namespace DB2PUML.Service;

public static class GeneratePUML
{
    public static string GenerateAllTables(
        List<SqlTable> tableList,
        string title,
        string fileName,
        bool excludeRelationshipsToTablesThatDontExist = false)
    {
        var sb = new StringBuilder();

        sb.AppendLine(SharedPuml.PumlHeader);

        foreach (var table in tableList)
        {
            sb.AppendLine($"table( {table.SchemaName}.{table.TableName} )");
            sb.AppendLine("{");
            foreach (var col in table.ColumnList)
            {
                if (col.IsPrimaryKey)
                    sb.AppendLine($"   primary_key( {col.ColumnName} ): {col.DataType} <<PK>>");
                else if (col.IsForeignKey)
                    sb.AppendLine($"   foreign_key( {col.ColumnName} ): {col.DataType} <<FK>>");
                else
                    sb.AppendLine($"   column( {col.ColumnName} ): {col.DataType}");
            }
            sb.AppendLine("}");
        }

        sb.AppendLine("' *** Define Table Relationships");

        foreach (var table in tableList)
        {
            foreach (var item in table.ForeignKeyList)
            {
                if (excludeRelationshipsToTablesThatDontExist == true)
                {
                    var count = tableList.Where(x => x.SchemaName == item.PkSchemaName && x.TableName == item.PkTableName).Count();
                    if (count == 0)
                        continue;
                }

                sb.AppendLine($"{item.FkSchemaName}.{item.FkTableName} {OneToManyRelationship(false)} {item.PkSchemaName}.{item.PkTableName}");
            }

        }

        sb.AppendLine("@enduml");

        var text = sb.ToString();

        File.WriteAllText(fileName, sb.ToString());

        return text;
    }

    public static string GenerateTablesWithNoRelationships(
        List<SqlTable> tableList,
        string title,
        string fileName)
    {
        var sb = new StringBuilder();

        var toProcessList = new List<SqlTable>();

        foreach (var table in tableList)
        {
            if (table.ForeignKeyList.Count == 0)
            {
                bool relationshipFound = false;

                // Ok.. This table doesnt rely on other tables, but do other tables rely on this?
                foreach (var t in tableList)
                {
                    foreach (var key in t.ForeignKeyList)
                    {
                        if (key.PkSchemaName == table.SchemaName && key.PkTableName == table.TableName)
                        {
                            // this table has a relationship with our table! 
                            relationshipFound = true;
                            break;
                        }
                    }

                    if (relationshipFound == true)
                        break;
                }

                if (relationshipFound == false)
                    toProcessList.Add(table);
            }
        }


        sb.AppendLine(SharedPuml.PumlHeader);

        foreach (var table in toProcessList)
        {
            sb.AppendLine($"table( {table.SchemaName}.{table.TableName} )");
            sb.AppendLine("{");
            foreach (var col in table.ColumnList)
            {
                if (col.IsPrimaryKey)
                    sb.AppendLine($"   primary_key( {col.ColumnName} ): {col.DataType} <<PK>>");
                else if (col.IsForeignKey)
                    sb.AppendLine($"   foreign_key( {col.ColumnName} ): {col.DataType} <<FK>>");
                else
                    sb.AppendLine($"   column( {col.ColumnName} ): {col.DataType}");
            }
            sb.AppendLine("}");
        }

        sb.AppendLine("' *** Define Table Relationships");

        foreach (var table in toProcessList)
        {
            foreach (var item in table.ForeignKeyList)
            {
                sb.AppendLine($"{item.FkSchemaName}.{item.FkTableName} {OneToManyRelationship(false)} {item.PkSchemaName}.{item.PkTableName}");
            }

        }

        sb.AppendLine("@enduml");

        var text = sb.ToString();

        File.WriteAllText(fileName, sb.ToString());

        return text;
    }

    public static string GenerateAllRelationships(
        List<SqlTable> tableList,
        string title,
        string fileName)
    {
        var sb = new StringBuilder();

        var toProcessList = new List<SqlTable>();

        foreach (var table in tableList)
        {
            if (table.ForeignKeyList.Count == 0)
            {
                bool relationshipFound = false;

                // Ok.. This table doesnt rely on other tables, but do other tables rely on this?
                foreach (var t in tableList)
                {
                    foreach (var key in t.ForeignKeyList)
                    {
                        if (key.PkSchemaName == table.SchemaName && key.PkTableName == table.TableName)
                        {
                            // this table has a relationship with our table! 
                            relationshipFound = true;
                            break;
                        }
                    }

                    if (relationshipFound == true)
                        break;
                }

                if (relationshipFound == true)
                    toProcessList.Add(table);
            }
            else
            {
                toProcessList.Add(table);
            }
        }


        sb.AppendLine(SharedPuml.PumlHeader);

        foreach (var table in toProcessList)
        {
            sb.AppendLine($"table( {table.SchemaName}.{table.TableName} )");
            sb.AppendLine("{");
            foreach (var col in table.ColumnList)
            {
                if (col.IsPrimaryKey)
                    sb.AppendLine($"   primary_key( {col.ColumnName} ): {col.DataType} <<PK>>");
                else if (col.IsForeignKey)
                    sb.AppendLine($"   foreign_key( {col.ColumnName} ): {col.DataType} <<FK>>");
                else
                    sb.AppendLine($"   column( {col.ColumnName} ): {col.DataType}");
            }
            sb.AppendLine("}");
        }

        sb.AppendLine("' *** Define Table Relationships");

        foreach (var table in toProcessList)
        {
            foreach (var item in table.ForeignKeyList)
            {
                sb.AppendLine($"{item.FkSchemaName}.{item.FkTableName} {OneToManyRelationship(false)} {item.PkSchemaName}.{item.PkTableName}");
            }

        }

        sb.AppendLine("@enduml");

        var text = sb.ToString();

        File.WriteAllText(fileName, sb.ToString());

        return text;
    }

    // https://plantuml.com/ie-diagram
    private static string OneToManyRelationship(bool dot)
    {
        return dot ? "}|..||" : "}|--||";
    }

    private static string ZeroToOneRelationship(bool dot)
    {
        return dot ? "|o.." : "|o--";
    }

    private static string ExactlyOneRelationship(bool dot)
    {
        return dot ? "||.." : "||--";
    }
}
