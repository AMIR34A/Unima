using Unima.Dal.Entities.Entities;
using Unima.Dal.Enums;

namespace Unima.Dal.Entities.Models;

public class Plan
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public required PlanType Type { get; set; }

    public required byte Period { get; set; }

    public required byte CountOfMeal { get; set; }

    public bool? HasTelegramBot { get; set; }

    public bool? HasSMSNotification { get; set; }

    public bool? HasEmailNotification { get; set; }

    public bool? CountOfSMS { get; set; }

    public string? Description { get; set; }

    public required int Price { get; set; }

    public ICollection<ApplicationUser> Users { get; set; }
}