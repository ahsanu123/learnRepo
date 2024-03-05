using Microsoft.AspNetCore.Mvc;
using erpPlanner.Model;
using erpPlanner.Repository;

namespace erpPlanner.Controllers;


[ApiController]
[Route("material/")]
public class MaterialController : Controller
{
    private readonly IMaterialRepository _materiaRepository;

    public MaterialController(IMaterialRepository materialRepository)
    {
        _materiaRepository = materialRepository;
    }

    [Route("{Id}")]
    [HttpGet]
    public async Task<ActionResult> GetMaterialById([FromRoute] int Id)
    {
        var material = await _materiaRepository.GetMaterialById(Id);
        if (material != null)
        {
            return Ok(material);
        }

        return NotFound();
    }


    [Route("all")]
    [HttpGet]
    public async Task<ActionResult> GetAllMaterial()
    {
        var allMaterial = await _materiaRepository.GetMaterial();
        if (allMaterial != null)
        {
            return Ok(allMaterial);
        }
        return NotFound();
    }



}
