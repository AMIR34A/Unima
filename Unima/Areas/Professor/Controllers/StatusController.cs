using Microsoft.AspNetCore.Mvc;

namespace Unima.Areas.Professor.Controllers;

public class StatusController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}