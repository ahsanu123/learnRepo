namespace erpPlanner.Model;

public class LoggerModel : BaseModel
{
    public DateTime Date { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }

    public int? ProjectId { get; set; }
}
