using Microsoft.AspNetCore.Mvc;

namespace Unima.Controllers
{
    public class AccountController : Controller
    {
        public IActionResult SignIn()
        {
            return View();
        }
    }
}
