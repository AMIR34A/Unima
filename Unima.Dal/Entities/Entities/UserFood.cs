using Unima.Dal.Entities.Models;

namespace Unima.Dal.Entities.Entities;

public class UserFood
{
    public int UserId { get; set; }
    public required ApplicationUser User { get; set; }

    public int FoodId { get; set; }
    public required Food Food { get; set; }

    public int SelfLocationId { get; set; }
    public required SelfLocation SelfLocation { get; set; }

    public bool IsReservationEnabled { get; set; }

    public DateTime LastReservation { get; set; }
}
