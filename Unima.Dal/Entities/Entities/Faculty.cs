namespace Unima.Dal.Entities.Entities;

public class Faculty
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string Address { get; set; }

    public ICollection<Department> Departments { get; set; }
}
