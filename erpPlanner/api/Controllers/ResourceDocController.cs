using Microsoft.AspNetCore.Mvc;
using erpPlanner.Repository;
using erpPlanner.Model;
using erpPlanner.Util;

namespace erpPlanner.Controllers;

[ApiController]
[Route("ResourceDoc/")]
public class ResourceDocController : Controller
{

    private readonly IResourceDocRepository _resourceDocRepository;
    private readonly IMaterialRepository _materialRepositoy;


    public ResourceDocController(
        IResourceDocRepository resourceDocRepository,
        IMaterialRepository materialRepository
        )
    {
        _resourceDocRepository = resourceDocRepository;
        _materialRepositoy = materialRepository;
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult> CreateResourceDoc([FromBody] ResourceDoc newResourceDoc)
    {
        var material = await _materialRepositoy.GetMaterialById(newResourceDoc.materialId);
        if (material == null)
        {
            return NotFound(new ErrorMessage()
            {
                Message = $"Material With Id: {newResourceDoc.materialId} Not Found",
                Description = "Make Sure Material Id Is Correct"
            });
        }
        var result = await _resourceDocRepository.CreateResourceDoc(newResourceDoc);

        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult> GetResorceDocById(int resourceDocId)
    {

        var resourceDoc = await _resourceDocRepository.GetResourceDocsById(resourceDocId);
        if (resourceDoc != null)
        {
            return Ok(resourceDoc);
        }
        return NotFound(new ErrorMessage()
        {
            Message = $"Resource Doc With Id: {resourceDocId} Not Found "
        });
    }

    [HttpGet]
    [Route("list")]
    public async Task<ActionResult> GetListResouceDoc()
    {
        var listResourceDoc = await _resourceDocRepository.GetResourceDocs();
        if (listResourceDoc != null)
        {
            return Ok(listResourceDoc);
        }
        return NotFound();
    }

    [HttpPost]
    [Route("update")]
    public async Task<ActionResult> UpdateResouceDoc([FromBody] ResourceDoc updatedResourceDoc)
    {

        var result = await _resourceDocRepository.UpdateResourceDoc(updatedResourceDoc);
        return Ok(result);
    }

    [HttpDelete]
    [Route("delete")]
    public async Task<ActionResult> DeleteResourceDoc([FromQuery] int resourceDocId)
    {

        var resourceDoc = await _resourceDocRepository.GetResourceDocsById(resourceDocId);
        if (resourceDoc == null)
        {
            return NotFound(new ErrorMessage()
            {
                Message = $"Resource Doc With Id: {resourceDocId} Not found ",
            });
        }
        var affectedRow = await _resourceDocRepository.deleteResourceDoc(resourceDocId);
        return Ok(affectedRow);
    }

}
