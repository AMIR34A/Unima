using Microsoft.AspNetCore.Mvc;

namespace Unima.Areas.Professor.Controllers;

[Area("Professor")]
public class StatusController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}