namespace Unima.Dal.Entities.Entities;

public class Department
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public int FacultyId { get; set; }
    public required Faculty Faculty { get; set; }

    public ICollection<Lesson> Lessons { get; set; }
}