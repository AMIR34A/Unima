using Microsoft.AspNetCore.Mvc;
using Unima.Biz.UoW;
using Unima.Dal.Entities.Models.Support;

namespace Unima.Controllers;

public class AccountController : Controller
{
    private readonly IUnitOfWork _unitOfWork;
    public AccountController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IActionResult> Index()
    {
        List<Support> supports = await _unitOfWork.RepositoryBase<Support>().GetAllAsync();
        return View(supports);
    }
}
