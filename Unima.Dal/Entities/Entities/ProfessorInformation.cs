using Unima.Dal.Enums;

namespace Unima.Dal.Entities.Entities;

public class ProfessorInformation
{
    public int Id { get; set; }

    public required ApplicationUser User { get; set; }

    public Degree Degree { get; set; }

    public int OfficeNo { get; set; }

    public OfficeStatus RoomStatus { get; set; }

    public Line Line { get; set; }

    public Side Side { get; set; }

    public string? Biography { get; set; }

    public required string Address { get; set; }

    public string? Description { get; set; }

    public string? OfficePhoneNumber { get; set; }

    public string? PublicPhoneNumber { get; set; }

    public required string Department { get; set; }

    public required string Role { get; set; }
}