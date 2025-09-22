using Unima.Dal.Enums;

namespace Unima.Areas.Faculty.Models;

public class ProfessorModel
{
    public required int Id { get; set; }

    public required string FullName { get; set; }

    public required string ProfileImageURL { get; set; }

    public required string Faculty { get; set; }

    public required string Department { get; set; }

    public required Degree Degree { get; set; }

    public required string Role { get; set; }

    public string? Bio { get; set; }

    public string? Email { get; set; }

    public string? PublicPhoneNumber { get; set; }

    public string? OfficeAddess { get; set; }

    public int? OfficeNo { get; set; }

    public OfficeStatus OfficeStatus { get; set; }

    public string? Description { get; set; }


    public IEnumerable<string>? Lessons { get; set; }
}