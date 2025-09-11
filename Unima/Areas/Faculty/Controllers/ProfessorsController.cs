using Microsoft.AspNetCore.Mvc;

namespace Unima.Areas.Faculty.Controllers;

[Area("Faculty")]
public class ProfessorsController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}