using Microsoft.AspNetCore.Mvc;

namespace Unima.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
