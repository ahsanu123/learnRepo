using Microsoft.AspNetCore.Mvc;
using erpPlanner.Repository;
using erpPlanner.Model;

namespace erpPlanner.Controllers;

[ApiController]
[Route("Storage/")]
public class StorageController : Controller
{
    private readonly IStorageRepository _storageRepository;

    public StorageController(IStorageRepository storageRepository)
    {
        _storageRepository = storageRepository;
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult> CreateStorage([FromBody] Storage newStorage)
    {
        var result = await _storageRepository.CreateStorage(newStorage);
        if (result != 0)
        {
            return Ok(result);
        }
        return NotFound();
    }

    [HttpPost]
    [Route("update")]
    public async Task<ActionResult> UpdateStorage([FromBody] Storage newStorage)
    {
        var result = await _storageRepository.UpdateStorage(newStorage);
        if (result != null)
        {
            return Ok(result);
        }
        return NotFound();
    }

    [HttpGet]
    public async Task<ActionResult<Storage>> GetStorage([FromQuery] int storageid)
    {
        var storage = await _storageRepository.GetStorage(storageid);
        if (storage != null)
        {
            return Ok(storage);
        }
        return NotFound();
    }

    [HttpGet]
    [Route("list")]
    public async Task<ActionResult> GetListStorage()
    {
        var list = await _storageRepository.GetListStorage();
        if (list != null)
        {
            return Ok(list);
        }
        return NotFound();

    }

    [HttpDelete]
    [Route("delete")]
    public async Task<ActionResult> DeleteStorage([FromQuery] int storageid)
    {

        var isStorageExist = await _storageRepository.GetStorage(storageid);
        if (isStorageExist != null)
        {
            var affectedRow = await _storageRepository.deleteStorage(storageid);
            return Ok(affectedRow);
        }
        return NotFound();
    }
}
