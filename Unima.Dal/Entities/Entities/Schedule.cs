using Unima.Dal.Enums;

namespace Unima.Dal.Entities.Entities;

public class Schedule
{
    public WeekDay DayOfWeek { get; set; }

    public WeekStatus WeekStatus { get; set; }

    public TimePeriod Period { get; set; }

    public int RoomNo { get; set; }

    public string? Address { get; set; }

    public int LessonProfessorId { get; set; }
    public int LessonNo { get; set; }
    public byte LessonGroupNo { get; set; }
    public required Lesson Lesson { get; set; }
}