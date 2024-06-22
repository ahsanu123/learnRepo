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
    public Task<int> uploadProductImage(byte[] image);
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
                name = newProject.Name,
                createddate = newProject.CreatedDate,
                deadlinedate = newProject.DeadLineDate,
                lastupdateddate = newProject.LastUpdatedDate,
                finisheddate = newProject.FinishedDate,
                sellprice = newProject.SellPrice,
                capital = newProject.Capital,
                fail = newProject.Fail,
                finish = newProject.Finish,
                profitinpersen = newProject.ProfitInPersen,
                description = newProject.Description
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
                name = updatedProject.Name,
                createddate = updatedProject.CreatedDate,
                deadlinedate = updatedProject.DeadLineDate,
                lastupdateddate = updatedProject.LastUpdatedDate,
                finisheddate = updatedProject.FinishedDate,
                sellprice = updatedProject.SellPrice,
                capital = updatedProject.Capital,
                fail = updatedProject.Fail,
                finish = updatedProject.Finish,
                profitinpersen = updatedProject.ProfitInPersen,
                description = updatedProject.Description
            });


            sql = $"SELECT *	FROM planerp_project WHERE projectId = @projectId;";
            var updatedResult = await conn.QuerySingleOrDefaultAsync<Project>(sql, new
            {
                projectId = updatedProject.Id
            });

            return updatedResult;
        }
    }

    public Task<int> uploadProductImage(byte[] image)
    {
        throw new NotImplementedException();
    }
}
