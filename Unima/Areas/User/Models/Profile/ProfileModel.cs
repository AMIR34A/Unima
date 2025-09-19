using System.ComponentModel.DataAnnotations;
using Unima.Dal.Enums;

namespace Unima.Areas.User.Models.Profile;

public class ProfileModel
{
    [Display(Name = "نام و نام خانوادگی")]
    public required string FullName { get; set; }

    [Display(Name = "نام کاربری")]
    public required string Username { get; set; }

    [Display(Name = "شماره موبایل")]
    public required string PhoneNumber { get; set; }

    [Display(Name = "ایمیل")]
    public string? Email { get; set; }

    [Display(Name = "رمز عبور سامانه سلف")]
    public string? SelfServicePassword { get; set; }

    [Display(Name = "جنسیت")]
    public required string Gender { get; set; }

    [Display(Name = "سلف پیشفرض")]
    public required string DefaultSelfService { get; set; }
}