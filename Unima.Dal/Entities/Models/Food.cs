using Unima.Dal.Enums;

namespace Unima.Dal.Entities.Models
{
    public class Food
    {
        public int Id { get; set; }

        public required string Title { get; set; }

        public required int Price { get; set; }

        public required FoodType Type { get; set; }

        public required WeekDay DayOfWeek { get; set; }

        public required MealType MealType { get; set; }

        public ICollection<ApplicationUser> Users { get; set; }
    }
}
