using System.ComponentModel.DataAnnotations;
using Unima.Dal.Enums;

namespace Unima.Areas.Professor.Models;

public class ScheduleModel
{
    [Display(Name = "نام درس")]
    public required string LessonTitle { get; set; }

    public required byte GroupNo { get; set; }

    [Display(Name = "شماره اتاق")]
    public required int RoomNo { get; set; }

    public required WeekDay DayOfWeek { get; set; }

    public required string DayTitle { get; set; }

    public required WeekStatus WeekStatus { get; set; }

    public TimePeriod Period { get; set; }

    public string? LessonId { get; set; }

    public string? Faculty { get; set; }
}