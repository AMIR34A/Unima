using System.ComponentModel.DataAnnotations;
using Unima.Dal.Enums;

namespace Unima.Areas.User.Models.Profile;

public class ScheduleModel
{
    [Display(Name = "شماره اتاق")]
    public required int RoomNo { get; set; }

    public required int DayOfWeek { get; set; }


    public required int WeekStatus { get; set; }

    public int Period { get; set; }

    public string? Faculty { get; set; }
}