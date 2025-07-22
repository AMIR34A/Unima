using Microsoft.AspNetCore.Mvc;

namespace Unima.Areas.Professor.Controllers;

[Area("User")]
public class StatusController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}