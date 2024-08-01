using System.ComponentModel.DataAnnotations;

namespace erpPlanner.Model;

public abstract class BaseModel
{
    [Key]
    public int? Id { get; set; }
}
