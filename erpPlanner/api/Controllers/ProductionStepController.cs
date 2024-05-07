using Microsoft.AspNetCore.Mvc;
using erpPlanner.Repository;
using erpPlanner.Model;

namespace erpPlanner.Controllers;

[ApiController]
[Route("productionStep/")]
public class ProductionStepController : Controller
{
    private readonly IProducingStepRepository _producingStepRepository;

    public ProductionStepController(IProducingStepRepository producingStepRepository)
    {
        _producingStepRepository = producingStepRepository;
    }

    [HttpPost]
    public async Task<ActionResult> CreateProductionStep([FromBody] ProducingStep producingStep)
    {
        var result = await _producingStepRepository.CreateProducingStep(producingStep);
        if (result != null)
        {
            return Ok(result);
        }
        return NotFound();
    }

    [HttpGet]
    public async Task<ActionResult> GetProductionStep(int producingStepId)
    {

        var result = await _producingStepRepository.GetProducingStep(producingStepId);
        if (result != null)
        {
            return Ok(result);
        }
        return NotFound();
    }
}
