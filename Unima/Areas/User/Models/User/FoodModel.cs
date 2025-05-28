using Unima.Dal.Enums;

namespace Unima.Areas.User.Models.User;

public class FoodModel
{
    public required string Title { get; set; }

    public int Price { get; set; }

    public WeekDay Day { get; set; }

    public MealType MealType { get; set; }
}
