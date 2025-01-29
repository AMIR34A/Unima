using Microsoft.AspNetCore.Identity;

namespace Unima.Dal.Entities;

public class ApplicationUser : IdentityUser
{
    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public DateTime RegisterDate { get; set; }

    public bool? IsActive { get; set; }
}
