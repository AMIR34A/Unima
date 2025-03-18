using System.ComponentModel.DataAnnotations;
using Unima.Biz.Attributes;

namespace Unima.Models.Account;

public class UserLogInModel
{
    [Display(Name = "شماره دانشجویی")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    public required string Username { get; set; }

    [Display(Name = "کلمه عبور")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    public required string Password { get; set; }

    [Display(Name = "من را به خاطر بسپار")]
    public bool RememberMe { get; set; }


    [GoogleCaptchaValidation]
    public required string GoogleCaptchaResponse { get; set; }
}
