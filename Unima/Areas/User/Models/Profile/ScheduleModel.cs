using System.ComponentModel.DataAnnotations;
using Unima.Dal.Enums;

namespace Unima.Areas.User.Models.Profile;

public class ScheduleModel
{
    [Display(Name = "شماره اتاق")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required int RoomNo { get; set; }

    [Display(Name = "روز هفته")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required int DayOfWeek { get; set; }

    [Display(Name = "وضعیت هفته")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required int WeekStatus { get; set; }

    [Display(Name = "بازه زمانی")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required int Period { get; set; }

    public int? OldWeekStatus { get; set; }

    public string? Faculty { get; set; }
}