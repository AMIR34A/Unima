using System.ComponentModel.DataAnnotations;
using Unima.Dal.Enums;

namespace Unima.Areas.User.Models.Appointment;

public class AppointmentModel
{
    [Required(AllowEmptyStrings = false, ErrorMessage = "آیدی یافت نشد")]
    public int Id { get; set; }

    [Display(Name = "موضوع")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required string Topic { get; set; }

    [Display(Name = "توضیحات")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public string? Description { get; set; }

    [Display(Name = "تاریخ و ساعت")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required DateTime DateTime { get; set; }

    [Display(Name = "مدت زمان")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required int Duration { get; set; }

    public string? SenderUsername { get; set; }

    public string? SenderFullName { get; set; }

    public string? LocationTitle { get; set; }

    public bool? IsStarred { get; set; }

    public AppointmentStatus? Status { get; set; }

    public string? RejectionDescription { get; set; }

    public DateTime? SuggestedDateTime { get; set; }
}