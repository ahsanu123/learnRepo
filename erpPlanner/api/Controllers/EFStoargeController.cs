using erpPlanner.Model;
using erpPlanner.Repository;
using Microsoft.AspNetCore.Mvc;

namespace erpPlanner.Controllers;

[ApiController]
[Route("EFStorage")]
public class EFStorageController : Controller
{
    private EFGenericCrud<Storage> _storageRepo;

    public EFStorageController(EFGenericCrud<Storage> storageRepo)
    {
        _storageRepo = storageRepo;
    }

    [HttpPost]
    public async Task<ActionResult> AddNew([FromBody] Storage storage)
    {
        await _storageRepo.Add(storage);
        return Ok();
    }
}
