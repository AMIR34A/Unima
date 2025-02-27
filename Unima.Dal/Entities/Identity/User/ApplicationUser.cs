using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using Unima.Dal.Entities.Models;
using Unima.Dal.Enums;

namespace Unima.Dal.Entities;

public class ApplicationUser : IdentityUser
{
    public required string FullName { get; set; }

    public DateTime RegisterDate { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? LastUpgradeLevel { get; set; }

    public string? SelfServicePassword { get; set; }

    public string? ReferredByUsername { get; set; }

    public ICollection<Food> Foods { get; set; }

    public int? PlanId { get; set; }
    public Plan? Plan { get; set; }
}