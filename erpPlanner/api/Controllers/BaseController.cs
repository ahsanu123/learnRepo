using erpPlanner.Model;
using erpPlanner.Repository;
using Microsoft.AspNetCore.Mvc;

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
    public Task<int> UpdateByModel(T model);
    public Task<ActionResult<int>> AddByModel(T model);
    public Task<int> DeleteById(int id);
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

    [HttpDelete("Delete")]
    public Task<int> DeleteById([FromRoute] int id)
    {
        throw new NotImplementedException();
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
    public Task<int> UpdateByModel([FromBody] T model)
    {
        throw new NotImplementedException();
    }
}
