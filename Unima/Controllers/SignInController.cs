using Microsoft.AspNetCore.Mvc;

namespace Unima.Controllers
{
    public class SignInController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
