using Microsoft.AspNetCore.Mvc;
using erpPlanner.Model;
using erpPlanner.Repository;
using System.Text;

namespace erpPlanner.Controllers;


[ApiController]
[Route("File/")]
public class FileController : Controller
{

    [HttpPost]
    public async Task<ActionResult> UploadResource(IFormFile res)
    {
        using (var image = res.OpenReadStream())
        {
            byte[] blob = new byte[image.Length];
            image.Read(blob, 0, (int)image.Length);
        }

        return Ok();
    }

}
