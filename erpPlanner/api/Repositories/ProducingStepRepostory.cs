using Dapper;
using erpPlanner.Services;
using erpPlanner.Model;
using Npgsql;

namespace erpPlanner.Repository;

public interface IProducingStepRepository
{
    public Task<IEnumerable<ProducingStep>> GetListProducingSteps();
    public Task<ProducingStep> GetProducingStep(int producingStepId);
    public Task<ProducingStep> CreateProducingStep(ProducingStep newProducingStep);
    public Task<ProducingStep> UpdateProducingStep(ProducingStep updatedProducingStep);
    public Task<int> deleteProducingStep(int producingStepId);
}

public class ProducingStepRepository : IProducingStepRepository
{
    private readonly PostgresqlConnectionProvider _connection;

    public ProducingStepRepository(PostgresqlConnectionProvider connection)
    {
        _connection = connection;
    }
    public async Task<ProducingStep> CreateProducingStep(ProducingStep newProducingStep)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = @"
              INSERT INTO public.plannerp_producing_step(
                producingstepid, projectid, liststep)
                VALUES ($1, $2, $3)  ;
            ";

            await conn.OpenAsync();
            await using var cmd = new NpgsqlCommand(sql, conn)
            {
                Parameters ={
                  new(){Value = newProducingStep.Id},
                  new(){Value = newProducingStep.ProjectId},
                  new(){Value = newProducingStep.ListStep},
                }
            };

            await cmd.ExecuteNonQueryAsync();

            string resultQuery = $"select * from plannerp_producing_step where producingstepid = {newProducingStep.Id}";
            var result = await conn.QueryFirstOrDefaultAsync<ProducingStep>(resultQuery);

            return result;
        }
    }

    public Task<int> deleteProducingStep(int producingStepId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<ProducingStep>> GetListProducingSteps()
    {
        throw new NotImplementedException();
    }

    public async Task<ProducingStep> GetProducingStep(int ProducingStepId)
    {
        using (var conn = _connection.CreateConnection())
        {
            string sql = $"SELECT * FROM plannerp_producing_step where producingstepid = {ProducingStepId};";
            var producingStep = await conn.QueryFirstOrDefaultAsync<ProducingStep>(sql);

            return producingStep;
        }
    }

    public Task<ProducingStep> UpdateProducingStep(ProducingStep updatedProducingStep)
    {
        throw new NotImplementedException();
    }
}


