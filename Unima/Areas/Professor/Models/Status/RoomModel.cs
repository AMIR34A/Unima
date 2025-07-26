using Unima.Dal.Enums;

namespace Unima.Areas.Professor.Models.Status;

public class RoomModel
{
    public required string ProfessorFullName { get; set; }

    public required int No { get; set; }

    public string? PhoneNumber { get; set; }

    public required string Status { get; set; }

    public required string StatusStr { get; set; }
}