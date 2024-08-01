namespace erpPlanner.Model;

public class Component : BaseModel
{
    public string Name { get; set; }
    public string Type { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    public float Price { get; set; }
    public float Capital { get; set; }
    public string Supplier { get; set; }
    public string SupplierLink { get; set; }
    public bool IsAssembly { get; set; }

    public int? StorageId { get; set; }
}
