using Microsoft.AspNetCore.Mvc;

namespace Unima.Areas.Professor.Controllers;

[Area("Professor")]
public class AppointmentController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
