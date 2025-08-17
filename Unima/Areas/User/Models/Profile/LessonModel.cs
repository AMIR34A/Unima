using System.ComponentModel.DataAnnotations;

namespace Unima.Areas.User.Models.Profile;

public class LessonModel
{
    [Display(Name = "نام درس")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required string Title { get; set; }

    [Display(Name = "کد درس")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public int No { get; set; }

    [Display(Name = "گروه درس")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    [Range(1,100,ErrorMessage ="عدد وارد شده باید بین {0} تا {1} باشد")]
    public byte GroupNo { get; set; }

    [Display(Name = "گروه تحصیلی")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public int DepartmentId { get; set; }
}
