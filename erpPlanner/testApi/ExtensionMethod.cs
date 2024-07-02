using Newtonsoft.Json;

namespace PlanerTests;

public static class TestExtensionMethod
{
    public static async Task<HttpResponseMessage> PrintDebug(
        this HttpResponseMessage response,
        bool withResponseBody = false
    )
    {
        response.EnsureSuccessStatusCode();

        var responseBody = JsonConvert.DeserializeObject(
            await response.Content.ReadAsStringAsync()
        );

        string jsonResponse = JsonConvert.SerializeObject(response, Formatting.Indented);
        string jsonResponseBody = JsonConvert.SerializeObject(responseBody, Formatting.Indented);

        Console.WriteLine(jsonResponse);
        if (withResponseBody)
            Console.WriteLine(responseBody);

        return response;
    }
}
