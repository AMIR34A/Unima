using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Unima.Dal.Entities;
using Unima.HelperClasses.SelfService;

namespace Unima.Areas.User.Controllers
{
    [Area("User")]
    public class DashboardController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ISelfService _selfService;

        public DashboardController(UserManager<ApplicationUser> userManager, ISelfService selfService)
        {
            _userManager = userManager;
            _selfService = selfService;
        }

        public async Task<IActionResult> Index()
        {
            ApplicationUser? user = await _userManager.GetUserAsync(User);

            if (user is null)
                return BadRequest();

            await _selfService.LogIn(user.UserName, user.SelfServicePassword);
            string balance = await _selfService.GetBalance();
            return View(model: balance);
        }
    }
}
