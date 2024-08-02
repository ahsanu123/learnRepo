using erpPlanner.Model;
using erpPlanner.Repository;
using Microsoft.AspNetCore.Mvc;

namespace erpPlanner.Controllers;

[ApiController]
[Route("[controller]")]
public class LoggerController : GenericController<LoggerModel>
{
    public LoggerController(GenericRepository<LoggerModel> repo)
        : base(repo) { }
}
