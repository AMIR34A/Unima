using Unima.Dal.Enums;

namespace Unima.Areas.User.Models.Plan;

public class PlanModel
{
    public required string Title { get; set; }

    public required PlanType Type { get; set; }

    public short Period { get; set; }

    public int Price { get; set; }

    public int CountOfMeal { get; set; }

    public bool HasTelegramBot { get; set; }

    public bool HasSmsNotification { get; set; }

    public bool HasEmailNotification { get; set; }
}
