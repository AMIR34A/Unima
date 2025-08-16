using System.ComponentModel.DataAnnotations;

namespace Unima.Areas.User.Models.Profile;

public class LocationModel
{
    public int? Id { get; set; }

    [Display(Name ="نام مکان")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required string Title { get; set; }

    [Display(Name = "آدرس")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required string Address { get; set; }

    [Display(Name = "لینک گوگل مپ")]
    public string? GoogleMapLink { get; set; }
}