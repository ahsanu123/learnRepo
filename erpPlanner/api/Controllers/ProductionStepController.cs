using erpPlanner.Model;
using erpPlanner.Repository;
using Microsoft.AspNetCore.Mvc;

namespace erpPlanner.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductionStepController : GenericController<ProducingStep>
{
    public ProductionStepController(GenericRepository<ProducingStep> repo)
        : base(repo) { }
}
