using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Unima.Models.Account;

public class UserRegisterModel
{
    [Display(Name = "نام و نام خانوادگی")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    public required string FullName { get; set; }

    [Display(Name = "شماره دانشجویی")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    public required string Username { get; set; }

    [Display(Name = "تلفن همراه")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    public required string PhoneNumber { get; set; }

    [Display(Name = "کلمه عبور")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    public required string SignUpPassword { get; set; }

    [Display(Name = "تکرار کلمه عبور")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    [Compare("SignUpPassword", ErrorMessage = "کلمه عبور و تکرار کلمه عبور یکسان نمی‌باشند")]
    public required string SignUpConfirmPassword { get; set; }

    public required bool IsAcceptedRule { get; set; }

    [Display(Name = "شماره دانشجویی معرف")]
    public string? ReferralUsername { get; set; }

    [BindProperty(Name = "g-recaptcha-response")]
    public required string GoogleCaptchaResponse { get; set; }
}
