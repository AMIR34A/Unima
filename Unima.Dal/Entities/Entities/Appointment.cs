using Unima.Dal.Enums;

namespace Unima.Dal.Entities.Entities;

public class Appointment
{
    public int Id { get; set; }

    public required string Topic { get; set; }

    public string? Description { get; set; }

    public required DateTime ReservedDateTime { get; set; }

    public required DateTime RequestSentOn { get; set; }

    public required int Duration { get; set; }

    public AppointmentStatus Status { get; set; }

    public bool IsStarred { get; set; }

    public string? RejectionDescription { get; set; }

    public DateTime? SuggestedDateTime { get; set; }

    public int LocationId { get; set; }
    public Location Location { get; set; }

    public int UserId { get; set; }
    public ApplicationUser User { get; set; }

    public int ProfessorId { get; set; }
    public ProfessorInformation Professor { get; set; }
}