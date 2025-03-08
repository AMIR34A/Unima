using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using Unima.Biz.Attributes;

namespace Unima.Models.Account;

public class UserRegisterModel
{
    [Display(Name = "نام و نام خانوادگی")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    public required string FullName { get; set; }

    [Display(Name = "شماره دانشجویی")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    [MaxLength(10, ErrorMessage = "حداکثر طول {0}، {1} عدد است")]
    [MinLength(9, ErrorMessage = "حداقل طول {0}، {1} عدد است")]
    public required string Username { get; set; }

    [Display(Name = "تلفن همراه")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    [RegularExpression("^09[0-9]{9}$", ErrorMessage = "الگوی صحیح {0}: 09123456789")]
    public required string PhoneNumber { get; set; }

    [Display(Name = "کلمه عبور")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    public required string Password { get; set; }

    [Display(Name = "تکرار کلمه عبور")]
    [Required(ErrorMessage = "وارد نمون {0} الزامی است")]
    [Compare("Password", ErrorMessage = "کلمه عبور و تکرار کلمه عبور یکسان نمی‌باشند")]
    public required string ConfirmPassword { get; set; }

    [Display(Name = "پذیرفتن قوانین")]
    [Required(ErrorMessage = "زدن تیک {0} الزامی است")]
    public required bool IsAcceptedRule { get; set; }

    [Display(Name = "شماره دانشجویی معرف")]
    [MaxLength(10, ErrorMessage = "حداکثر طول {0}، {1} عدد است")]
    [MinLength(9, ErrorMessage = "حداقل طول {0}، {1} عدد است")]
    [RegularExpression("^d+$", ErrorMessage = "{0} باید شامل فقط اعداد (0-9) باشد")]
    public string? ReferralUsername { get; set; }

    [GoogleCaptchaValidation]
    public required string GoogleCaptchaResponse { get; set; }
}
