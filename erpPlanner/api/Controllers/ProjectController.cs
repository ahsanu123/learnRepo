using Microsoft.AspNetCore.Mvc;
using erpPlanner.Repository;
using erpPlanner.Util;
using erpPlanner.Model;

namespace erpPlanner.Controllers;

[ApiController]
[Route("project/")]
public class ProjectController : Controller
{
    private readonly IProjectRepository _projectRepository;

    public ProjectController(IProjectRepository projectRepository)
    {
        _projectRepository = projectRepository;
    }

    [HttpGet]
    [Route("list")]
    public async Task<ActionResult> GetProjectList()
    {
        var projectList = await _projectRepository.GetProjects();
        if (projectList != null)
        {
            return Ok(projectList);
        }
        return NotFound();
    }

    [HttpGet]
    public async Task<ActionResult> GetProjectById([FromQuery] int projectId)
    {
        var project = await _projectRepository.GetProjectById(projectId);
        if (project != null)
        {
            return Ok(project);
        }
        return NotFound(new ErrorMessage()
        {
            Message = $"Project With Id: {projectId} NotFound"
        });
    }

    [HttpPost]
    [Route("create")]
    public async Task<ActionResult> CreateProject([FromBody] Project newProject)
    {

        var result = await _projectRepository.CreateProject(newProject);
        if (result != 0)
        {
            return Ok(result);
        }
        return BadRequest();
    }

    [HttpPost]
    [Route("update")]
    public async Task<ActionResult> UpdateProject([FromBody] Project updatedProject)
    {
        var project = await _projectRepository.GetProjectById(updatedProject.projectId);
        if (project == null)
        {
            return NotFound();
        }

        var updatedResult = await _projectRepository.UpdateProject(updatedProject);
        return Ok(updatedProject);
    }

    [HttpDelete]
    [Route("delete")]
    public async Task<ActionResult> DeleteProject([FromQuery] int projectId)
    {
        var project = await _projectRepository.GetProjectById(projectId);
        if (project == null)
        {
            return NotFound(new ErrorMessage()
            {
                Message = $"Project With ID: {projectId} NotFound, Failed To delete"
            });
        }
        var deletedResult = await _projectRepository.deleteProject(projectId);
        return Ok(deletedResult);
    }
}

