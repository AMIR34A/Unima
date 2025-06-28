namespace Unima.Areas.User.Models.Profile;

public class ProfileModel
{
    public required string FullName { get; set; }

    public string? Email { get; set; }

    public required string PhoneNumber { get; set; }

    public required string Username { get; set; }

    public int MyProperty { get; set; }
}