namespace erpPlanner.Model;

public class Component
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Type { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    public float Price { get; set; }
    public string Suplier { get; set; }
    public string SuplierLink { get; set; }
    public int StorageId { get; set; }
}