using Microsoft.AspNetCore.Mvc;
using erpPlanner.Model;
using erpPlanner.Repository;

namespace erpPlanner.Controllers;


[ApiController]
[Route("File/")]
public class FileController : Controller
{

    [HttpPost]
    public async Task<ActionResult> UploadResource(IFormFile res)
    {
        Console.WriteLine(res.FileName);
        Console.WriteLine($"{Path.GetExtension(res.FileName)}");
        return Ok();
    }

}
