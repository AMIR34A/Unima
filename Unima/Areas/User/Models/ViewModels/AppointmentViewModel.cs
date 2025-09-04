using System.ComponentModel.DataAnnotations;
using Unima.Dal.Enums;

namespace Unima.Areas.User.Models.ViewModels;

public class AppointmentViewModel
{
    public int Id { get; set; }

    public required string Topic { get; set; }

    public string? Description { get; set; }

    public required string Date { get; set; }

    public required string Time { get; set; }

    public required string RequestSentOn { get; set; }

    public required int Duration { get; set; }

    public required string SenderUsername { get; set; }

    public required string SenderFullName { get; set; }

    public required string LocationTitle { get; set; }

    public required bool IsStarred { get; set; }

    public required AppointmentStatus Status { get; set; }
}