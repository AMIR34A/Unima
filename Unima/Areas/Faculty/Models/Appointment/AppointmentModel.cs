using System.ComponentModel.DataAnnotations;
using Unima.Dal.Enums;

namespace Unima.Areas.Faculty.Models.Appointment;

public class AppointmentModel
{
    [Display(Name = "آیدی استاد")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required int ProfessorId { get; set; }

    [Display(Name = "موضوع")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required string Topic { get; set; }

    [Display(Name = "مکان")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required int LocationId { get; set; }

    [Display(Name = "توضیحات")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public string? Description { get; set; }

    [Display(Name = "تاریخ و ساعت")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required DateTime ReservedDateTime { get; set; }

    [Display(Name = "مدت زمان")]
    [Required(AllowEmptyStrings = false, ErrorMessage = "وارد نمودن {0} الزامی است")]
    public required int Duration { get; set; }
}