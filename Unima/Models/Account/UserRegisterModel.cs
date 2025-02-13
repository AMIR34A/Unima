namespace Unima.Models.Account;

public class UserRegisterModel
{
    public required string FullName { get; set; }

    public required string Username { get; set; }

    public required string PhoneNumber { get; set; }

    public required string Password { get; set; }

    public required string ConfirmPassword { get; set; }
    
    public required string ReferredByUsername { get; set; }

    public required string GoogleCaptchaResponse { get; set; }
}
