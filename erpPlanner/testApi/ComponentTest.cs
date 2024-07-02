using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

namespace PlanerTests;

// Todo Learn https://andrewlock.net/creating-parameterised-tests-in-xunit-with-inlinedata-classdata-and-memberdata
// [Theory]
// [InlineData]
// [MemberData]
// [ClassData]
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
