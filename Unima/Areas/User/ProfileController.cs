using Microsoft.AspNetCore.Mvc;

namespace Unima.Areas.User
{
    public class ProfileController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
