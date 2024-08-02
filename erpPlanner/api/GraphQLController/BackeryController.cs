using GraphQL.AspNet.Attributes;
using GraphQL.AspNet.Controllers;

namespace erpPlanner.Controllers;

public class BakeryController : GraphController
{
    [QueryRoot("donut")]
    public Donut RetrieveDonut()
    {
        return new Donut()
        {
            Id = 3,
            Name = "Snowy Dream",
            Flavor = "Vanilla"
        };
    }
}

public class Donut
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Flavor { get; set; }
}
