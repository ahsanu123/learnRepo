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
        var response = await _client.GetAsync("/Currency/GetRawCurrency");
        await response.PrintDebug();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
