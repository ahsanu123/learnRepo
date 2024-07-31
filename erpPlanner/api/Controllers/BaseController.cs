using erpPlanner.Model;
using erpPlanner.Repository;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace erpPlanner.Controllers;

[ApiController]
[Route("sql-command/")]
public class SqlCommandController : CrudBaseController<Storage>
{
    public SqlCommandController(BaseRepository<Storage> repo)
        : base(repo) { }
}

[ApiController]
[Route("HellYeah/")]
public class FuckingController : Controller
{
    private SqlCommandRepository _repo;

    public FuckingController(SqlCommandRepository repo)
    {
        _repo = repo;
    }

    [HttpGet]
    public async Task<ActionResult> RunSqlCommandSelectAll()
    {
        var result = await _repo.GetAll();

        return Ok(result);
    }
}

public interface IApiController<T>
{
    public Task<ActionResult<T>> GetAll();
    public Task<ActionResult<T>> GetById(int id);
    public Task<ActionResult> UpdateByModel(T model);
    public Task<ActionResult<int>> AddByModel(T model);
    public Task<ActionResult> DeleteById(int id);
}

public class CrudBaseController<T> : Controller, IApiController<T>
    where T : BaseModel
{
    public readonly BaseRepository<T> _repo;

    public CrudBaseController(BaseRepository<T> repo)
    {
        _repo = repo;
    }

    [HttpPost("AddNew")]
    public async Task<ActionResult<int>> AddByModel([FromBody] T model)
    {
        var result = await _repo.AddByModel(model);
        return Ok(result);
    }

    [HttpDelete("Delete/{id}")]
    public async Task<ActionResult> DeleteById([FromRoute] int id)
    {
        var idExists = await _repo.GetById(id);
        if (idExists == null)
        {
            return NotFound();
        }

        var result = await _repo.DeleteById(id);
        return Ok(result);
    }

    [HttpGet("GetAll")]
    public async Task<ActionResult<T>> GetAll()
    {
        var result = await _repo.GetAll();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<T>> GetById([FromRoute] int id)
    {
        var result = await _repo.GetById(id);
        if (result == null)
            return NotFound();
        return Ok(result);
    }

    [HttpPost("UpdateByModel")]
    public async Task<ActionResult> UpdateByModel([FromBody] T model)
    {
        var result = await _repo.UpdateByModel(model);
        return Ok();
    }
}
