using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Internal;
using Unima.Dal.Enums;

namespace Unima.Dal.Entities.Entities;

public class ProfessorInformation
{
    public int Id { get; set; }

    public required ApplicationUser User { get; set; }

    public Guid? ProfileImageId { get; set; }

    public Degree Degree { get; set; }

    public int OfficeNo { get; set; }

    public OfficeStatus OfficeStatus { get; set; }

    public string? Biography { get; set; }

    public required string Address { get; set; }

    public string? Description { get; set; }

    public required string Role { get; set; }

    public int DepartmentId { get; set; }
    public required Department Department { get; set; }

    public int? SocialMediaId { get; set; }
    public SocialMedia? SocialMedia { get; set; }

    public ICollection<Lesson> Lessons { get; set; }

    public ICollection<Location> Locations { get; set; }

    public ICollection<Appointment> Appointments { get; set; }
}