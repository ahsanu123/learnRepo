using System.Security.Claims;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OpenIddict.Abstractions;
using OpenIddict.Server.AspNetCore;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace erpPlanner.Controllers;

[ApiController]
[Route("openiddict")]
public class OpenIddictController : Controller
{
    private readonly IOpenIddictApplicationManager _applicationManager;

    public OpenIddictController(IOpenIddictApplicationManager applicationManager)
    {
        _applicationManager = applicationManager;
    }

    [HttpPost("~/connect/token")]
    public async Task<IActionResult> Exchange()
    {
        var request = HttpContext.GetOpenIddictServerRequest();
        if (request != null)
            return BadRequest(new { message = "Request is Null" });

        if (request.IsClientCredentialsGrantType())
        {
            var application =
                await _applicationManager.FindByClientIdAsync(request.ClientId)
                ?? throw new InvalidOperationException("The Application Cant be found!!");

            var identity = new ClaimsIdentity(
                TokenValidationParameters.DefaultAuthenticationType,
                Claims.Name,
                Claims.Role
            );
            identity.SetClaim(
                Claims.Subject,
                await _applicationManager.GetClientIdAsync(application)
            );
            identity.SetClaim(
                Claims.Name,
                await _applicationManager.GetDisplayNameAsync(application)
            );

            identity.SetDestinations(static claim =>
                claim.Type switch
                {
                    Claims.Name when claim.Subject.HasScope(Scopes.Profile)
                        => [Destinations.AccessToken, Destinations.IdentityToken],
                    _ => [Destinations.AccessToken]
                }
            );
            return SignIn(
                new ClaimsPrincipal(identity),
                OpenIddictServerAspNetCoreDefaults.AuthenticationScheme
            );
        }
        throw new NotImplementedException("The Spesfied grant is not implemented ");
    }
}
