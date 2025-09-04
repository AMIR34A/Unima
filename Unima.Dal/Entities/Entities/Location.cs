namespace Unima.Dal.Entities.Entities;

public class Location
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required string Address { get; set; }

    public string? GoogleMapLink { get; set; }

    public int ProfessorId { get; set; }
    public required ProfessorInformation Professor { get; set; }

    public ICollection<Appointment> Appointments { get; set; }
}