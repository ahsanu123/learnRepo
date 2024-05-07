using Dapper;
using erpPlanner.Services;
using erpPlanner.Model;

namespace erpPlanner.Repository;

public interface IProjectRepository
{
    public Task<IEnumerable<Project>> GetProjects();
    public Task<Project> GetProjectById(int projectId);
    public Task<int> CreateProject(Project newProject);
    public Task<Project> UpdateProject(Project updatedProject);
    public Task<int> deleteProject(int projectId);
}

public class ProjectRepository : IProjectRepository
{
    private readonly PostgresqlConnectionProvider _connection;

    public ProjectRepository(PostgresqlConnectionProvider connection)
    {
        _connection = connection;
    }

    public async Task<int> CreateProject(Project newProject)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = @"
            INSERT INTO planerp_project(
                name, 
                createddate, 
                deadlinedate, 
                lastupdateddate, 
                finisheddate, 
                sellprice, 
                capital, 
                fail, 
                finish, 
                profitinpersen, 
                description)
            VALUES (
                @name,
                @createddate, 
                @deadlinedate, 
                @lastupdateddate, 
                @finisheddate, 
                @sellprice, 
                @capital, 
                @fail, 
                @finish, 
                @profitinpersen, 
                @description)
            RETURNING projectid;";

            var createdProjectId = await conn.ExecuteScalarAsync<int>(sql, new
            {
                name = newProject.name,
                createddate = newProject.createdDate,
                deadlinedate = newProject.deadLineDate,
                lastupdateddate = newProject.lastUpdatedDate,
                finisheddate = newProject.finishedDate,
                sellprice = newProject.sellPrice,
                capital = newProject.capital,
                fail = newProject.fail,
                finish = newProject.finish,
                profitinpersen = newProject.profitInPersen,
                description = newProject.description
            });

            return createdProjectId;
        }
    }

    public async Task<int> deleteProject(int projectId)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $"DELETE FROM planerp_project WHERE projectId = @projectId";

            var affectedRow = await conn.ExecuteScalarAsync<int>(sql, new
            {
                projectId = projectId
            });
            return affectedRow;
        }
    }

    public async Task<Project> GetProjectById(int projectId)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $"SELECT *	FROM planerp_project WHERE projectId = @projectId;";
            var project = await conn.QuerySingleOrDefaultAsync<Project>(sql, new
            {
                projectId = projectId
            });
            return project;
        }
    }

    public async Task<IEnumerable<Project>> GetProjects()
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $"SELECT *	FROM public.planerp_project;";
            var project = await conn.QueryAsync<Project>(sql);
            return project;
        }
    }

    public async Task<Project> UpdateProject(Project updatedProject)
    {
        using (var conn = _connection.CreateConnection())
        {

            string sql = @"
          UPDATE planerp_project
          SET 
            name=@name, 
            createddate=@createdDate, 
            deadlinedate=@deadLineDate, 
            lastupdateddate=@lastupdateddate, 
            finisheddate=@finisheddate, 
            sellprice=@sellprice, 
            capital=@capital, 
            fail=@fail, 
            finish=@finish, 
            profitinpersen=@profitinpersen, 
            description=@description
          WHERE projectid = @projectId;";

            await conn.ExecuteAsync(sql, new
            {
                name = updatedProject.name,
                createddate = updatedProject.createdDate,
                deadlinedate = updatedProject.deadLineDate,
                lastupdateddate = updatedProject.lastUpdatedDate,
                finisheddate = updatedProject.finishedDate,
                sellprice = updatedProject.sellPrice,
                capital = updatedProject.capital,
                fail = updatedProject.fail,
                finish = updatedProject.finish,
                profitinpersen = updatedProject.profitInPersen,
                description = updatedProject.description
            });


            sql = $"SELECT *	FROM planerp_project WHERE projectId = @projectId;";
            var updatedResult = await conn.QuerySingleOrDefaultAsync<Project>(sql, new
            {
                projectId = updatedProject.projectId
            });

            return updatedResult;
        }
    }
}
