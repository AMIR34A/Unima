using Microsoft.AspNetCore.Mvc.Rendering;
using Unima.Areas.User.Models.Profile;

namespace Unima.Areas.User.Models.ViewModels;

public class ProfileViewModel
{
    public required ProfileModel ProfileModel { get; set; }
}
