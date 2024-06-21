using System.Reflection;
using erpPlanner.assem;
using erpPlanner.Repository;
using Microsoft.AspNetCore.Mvc;

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

    [Route("assembly")]
    [HttpGet]
    public ActionResult CheckAssembly()
    {

        List<BaseAssem> listAssem = new List<BaseAssem>();
        List<string> listHello = new List<string>();

        var assembly = Assembly.GetAssembly(typeof(BaseAssem))
          .GetTypes()
          .Where(type => type.IsClass && !type.IsAbstract && type.IsSubclassOf(typeof(BaseAssem)));

        foreach (var item in assembly)
        {
            listAssem.Add((BaseAssem)Activator.CreateInstance(item));
            var attr = System.Attribute.GetCustomAttributes(item);
            if (attr.Length > 0)
            {
                listHello.Add("got once");
            }

        }
        foreach (var item in listAssem)
        {
            listHello.Add(item.hello());
        }

        return Ok(listHello);
    }
}
