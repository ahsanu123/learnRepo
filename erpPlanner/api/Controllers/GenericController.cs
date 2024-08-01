using erpPlanner.Model;
using erpPlanner.Repository;
using Microsoft.AspNetCore.Mvc;

namespace erpPlanner.Controllers;

[ApiController]
public class GenericController<T> : Controller
    where T : BaseModel
{
    private GenericRepository<T> _repo;

    public GenericController(GenericRepository<T> repo)
    {
        _repo = repo;
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult> AddNew([FromBody] T model)
    {
        await _repo.Add(model);
        return Ok();
    }

    [HttpGet]
    [Route("get/{id}")]
    public async Task<ActionResult> Get([FromRoute] int id)
    {
        var result = await _repo.Get(id);
        if (result == null)
            return NotFound(new { message = $"Not Found Id: {id}" });

        return Ok(result);
    }

    [HttpGet]
    [Route("all")]
    public async Task<ActionResult> GetAll()
    {
        var data = await _repo.GetAll();
        return Ok(data);
    }

    [HttpPut]
    [Route("update")]
    public async Task<ActionResult> Update([FromBody] T model)
    {
        var result = await _repo.Update(model);
        if (result == null)
            return BadRequest();
        return Ok(result);
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<ActionResult> Delete([FromRoute] int id)
    {
        var result = await _repo.Delete(id);
        return Ok(result);
    }
}
