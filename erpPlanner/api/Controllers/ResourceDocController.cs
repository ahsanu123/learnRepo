using erpPlanner.Model;
using erpPlanner.Repository;
using Microsoft.AspNetCore.Mvc;

namespace erpPlanner.Controllers;

[ApiController]
[Route("[controller]")]
public class ResourceDocumentController : GenericController<ResourceDoc>
{
    public ResourceDocumentController(GenericRepository<ResourceDoc> repo)
        : base(repo) { }
}
