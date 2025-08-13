using Unima.Dal.Enums;

namespace Unima.Areas.Professor.Models;

public class ScheduleModel
{
    public required string LessonTitle { get; set; }

    public required byte GroupNo { get; set; }

    public required int RoomNo { get; set; }

    public required WeekDay DayOfWeek { get; set; }

    public required string DayTitle { get; set; }

    public required WeekStatus WeekStatus { get; set; }

    public TimePeriod Period { get; set; }
}