using erpPlanner.Model;
using erpPlanner.Repository;
using Microsoft.AspNetCore.Mvc;

namespace erpPlanner.Controllers;

[ApiController]
[Route("[controller]")]
public class ComponentController : GenericController<Component>
{
    public ComponentController(GenericRepository<Component> repo)
        : base(repo) { }
}
