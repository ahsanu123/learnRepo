namespace erpPlanner.Model;

public class Project : BaseModel
{
    public string Name { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? DeadLineDate { get; set; }
    public DateTime LastUpdatedDate { get; set; }
    public DateTime? FinishedDate { get; set; }
    public double? SellPrice { get; set; }
    public double Capital { get; set; }
    public bool Fail { get; set; }
    public bool Finish { get; set; }
    public double? ProfitInPersen { get; set; }
    public string? Description { get; set; }
}
