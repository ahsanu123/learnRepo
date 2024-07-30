using Microsoft.AspNetCore.Identity;

namespace erpPlanner.Model;

public class CustomIdentityModel : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string CustomTag { get; set; }
}

public class RegisterIdentityModal
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Password { get; set; }
}
