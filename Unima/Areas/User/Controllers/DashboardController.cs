using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Unima.Dal.Entities;
using Unima.HelperClasses.SelfService;

namespace Unima.Areas.User.Controllers
{    
    [Authorize]
    [Area("User")]
    public class DashboardController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ISelfServiceBuilder _selfServiceBuilder;

        public DashboardController(UserManager<ApplicationUser> userManager, ISelfServiceBuilder selfServiceBuilder)
        {
            _userManager = userManager;
            _selfServiceBuilder = selfServiceBuilder;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }

        [HttpGet]
        [Route("User/Dashboard/GetCredit")]
        public async Task<string> GetCredit()
        {
            ApplicationUser? user = await _userManager.GetUserAsync(User);

            if (user is null)
                return string.Empty;

            if (string.IsNullOrWhiteSpace(user.SelfServicePassword))
                return "ابتدا از داخل تنظیمات رمز عبور سامانه سلف را ثبت نمایید";

            SelfService? selfService = await _selfServiceBuilder
                .WithCredentials(user.UserName, user.SelfServicePassword)
                .BuildAsync();

            return await selfService.GetBalance();
        }
    }
}
