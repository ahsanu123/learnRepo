using erpPlanner.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace erpPlanner.Controllers;

[ApiController]
public class IdentityController : Controller
{
    private UserManager<CustomIdentityModel> _usermanager;
    private SignInManager<CustomIdentityModel> _signinManager;

    public IdentityController(
        UserManager<CustomIdentityModel> userManager,
        SignInManager<CustomIdentityModel> signInManager
    )
    {
        _usermanager = userManager;
        _signinManager = signInManager;
    }

    [HttpPost]
    [Route("register")]
    public async Task<ActionResult> register([FromBody] RegisterIdentityModal identityModel)
    {
        var registerData = new CustomIdentityModel()
        {
            Email = identityModel.Email,
            FirstName = identityModel.FirstName,
            LastName = identityModel.LastName,
            UserName = identityModel.UserName,
        };
        var result = await _usermanager.CreateAsync(registerData, identityModel.Password);
        if (result.Succeeded)
            return Ok(new { messsage = "Registration Successfull" });

        return BadRequest(new { Errors = result.Errors });
    }

    [HttpGet]
    [Route("external-login-info")]
    public async Task<IActionResult> GetExternalLoginInfo()
    {
        var externalLoginInfo = (
            await _signinManager.GetExternalAuthenticationSchemesAsync()
        ).ToList();

        return Ok(JsonConvert.SerializeObject(externalLoginInfo, Formatting.Indented));
    }
}
