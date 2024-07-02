using System.Net;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;

namespace PlanerTests;

public class ComponentTest : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ComponentTest(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCurrency()
    {
        string actual = "HellYeah";
        var response = await _client.GetAsync("/Currency/GetRawCurrency");
        string jsonResponse = JsonConvert.SerializeObject(response, Formatting.Indented);
        // Console.WriteLine(jsonResponse);

        actual.Should().StartWith("AB").And.EndWith("HI").And.Contain("EF").And.HaveLength(9);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // [Fact]
    // public async Task GetErrorEndpoint()
    // {
    //     var response = await _client.GetAsync("/material/all");
    //     string jsonResponse = JsonConvert.SerializeObject(response, Formatting.Indented);
    //     // Console.WriteLine(jsonResponse);
    //
    //     Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
    // }
}
