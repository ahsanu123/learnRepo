

namespace erpPlanner.Model;

public class Project
{
    public int projectId { get; set; }
    public string name { get; set; }
    public DateTime createdDate { get; set; }
    public DateTime? deadLineDate { get; set; }
    public DateTime lastUpdatedDate { get; set; }
    public DateTime? finishedDate { get; set; }
    public double? sellPrice { get; set; }
    public double capital { get; set; }
    public bool fail { get; set; }
    public bool finish { get; set; }
    public double? profitInPersen { get; set; }
    public string? description { get; set; }
}
