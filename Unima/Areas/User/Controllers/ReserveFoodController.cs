using Microsoft.AspNetCore.Mvc;

namespace Unima.Areas.User.Controllers;
[Area("User")]

public class ReserveFoodController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}