namespace Unima.Models.ViewModels;

public class UserVerificationViewModel
{
    public required string PhoneNumber { get; set; }

    public string? Token { get; set; }

    public required string Password { get; set; }
}
