using Unima.Dal.Entities.Entities;
using Unima.Dal.Enums;

namespace Unima.Dal.Entities.Models;

public class SelfLocation
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public Gender Gender { get; set; }

    public ICollection<ApplicationUser> Users { get; set; }

    public ICollection<UserFood> UserFoods { get; set; }
}