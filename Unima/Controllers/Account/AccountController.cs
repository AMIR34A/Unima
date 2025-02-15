using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Unima.Biz.UoW;
using Unima.Dal.Entities;
using Unima.Dal.Entities.Models.Support;
using Unima.MapperConfigs;
using Unima.Models.Account;
using Unima.Models.ViewModels;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Unima.Controllers.Account;

public class AccountController : Controller
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AccountController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IActionResult> Index()
    {
        AccountViewModel model = new AccountViewModel()
        {
            Supports = await _unitOfWork.RepositoryBase<Support>().GetAllAsync()
        };
        return View(model);
    }

    public async Task<IActionResult> RegisterAsync(UserRegisterModel registerModel)
    {
        ApplicationUser user = MapperConfig.ApplicationUserMap(registerModel);

        IdentityResult identityResult = await _userManager.CreateAsync(user, registerModel.SignUpConfirmPassword);

        if (identityResult.Succeeded)
        {
            SignInResult signInResult = await _signInManager.PasswordSignInAsync(user, registerModel.SignUpConfirmPassword, false, false);
            if (signInResult.Succeeded)
                return View("Verification");
        }
        return View("Index");
    }

    public async Task<IActionResult> Verification()
    {
        return View();
    }
}