using Microsoft.AspNetCore.Mvc;

namespace Unima.Areas.Professor.Controllers;

public class AppointmentController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
