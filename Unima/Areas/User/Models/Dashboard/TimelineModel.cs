using Unima.Dal.Enums;

namespace Unima.Areas.User.Models.Dashboard;

public class TimelineModel
{
    public required string Title { get; set; }

    public required WeekDay DayOfWeek { get; set; }

    public required string Time { get; set; }
}