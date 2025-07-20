using Microsoft.AspNetCore.Mvc;

namespace Unima.Areas.User.Controllers;

public class ReserveFoodController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}