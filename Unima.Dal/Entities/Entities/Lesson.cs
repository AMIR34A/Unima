namespace Unima.Dal.Entities.Entities;

public class Lesson
{
    public required string Title { get; set; }

    public int No { get; set; }

    public byte GroupNo { get; set; }

    public int ProfessorId { get; set; }
    public required ProfessorInformation Professor { get; set; }

    public int DepartmentId { get; set; }
    public required Department Department { get; set; }

    public ICollection<Schedule> Schedules { get; set; }
}