using erpPlanner.Model;
using erpPlanner.Repository;
using Microsoft.AspNetCore.Mvc;

namespace erpPlanner.Controllers;

[ApiController]
[Route("[controller]")]
public class ProjectController : GenericController<Project>
{
    public ProjectController(GenericRepository<Project> repo)
        : base(repo) { }
}
