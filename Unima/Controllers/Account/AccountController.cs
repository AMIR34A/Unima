using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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

    public AccountController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<IActionResult> Index()
    {
        AccountViewModel model = new AccountViewModel()
        {
            Supports = await _unitOfWork.RepositoryBase<Support>().GetAllAsync()
        };
        return View(model);
    }

    [HttpPost]
    public async Task<IActionResult> LogIn(UserLogInModel userLogInModel)
    {
        AccountViewModel viewModel = new AccountViewModel()
        {
            Supports = await _unitOfWork.RepositoryBase<Support>().GetAllAsync(),
            UserLogInModel = userLogInModel
        };

        if (!ModelState.IsValid)
        {
            SetFirstError(ModelState, "LogInError");
            return View("Index", viewModel);
        }

        ApplicationUser? user = await _userManager.FindByNameAsync(userLogInModel.Username);

        if (user is null)
            return BadRequest();

        SignInResult signInResult = await _signInManager.PasswordSignInAsync(user, userLogInModel.Password, false, false);
        if (signInResult.IsNotAllowed)
        {
            string token = await _userManager.GenerateChangePhoneNumberTokenAsync(user, user.PhoneNumber);
            Console.WriteLine(token);

            UserVerificationViewModel verificationViewModel = new()
            {
                PhoneNumber = user.PhoneNumber
            };
            return View("Verification", verificationViewModel);
        }
        else if (signInResult.IsLockedOut)
        {
            ModelState.AddModelError(string.Empty, "اکانت شما قفل شده است؛ با یکی از پشتیبان‌ها در تماس باشید.");
            SetFirstError(ModelState, "SignUpError");
            return View("Index", viewModel);
        }

        return RedirectToAction("Index", "Dashboard", new { area = "User" });
    }

    [HttpPost]
    public async Task<IActionResult> RegisterAsync(AccountViewModel accountViewModel)
    {
        UserRegisterModel registerModel = accountViewModel.UserRegisterModel;

        AccountViewModel viewModel = new AccountViewModel()
        {
            Supports = await _unitOfWork.RepositoryBase<Support>().GetAllAsync(),
            UserRegisterModel = registerModel
        };

        if (!ModelState.IsValid)
        {
            SetFirstError(ModelState, "SignUpError");
            return View("Index", viewModel);
        }

        ApplicationUser user = MapperConfig.ApplicationUserMap(registerModel);

        IdentityResult identityResult = await _userManager.CreateAsync(user, registerModel.Password);

        if (identityResult.Succeeded)
        {
            SignInResult signInResult = await _signInManager.PasswordSignInAsync(user, registerModel.ConfirmPassword, false, false);
            if (signInResult.IsNotAllowed)
            {
                string token = await _userManager.GenerateChangePhoneNumberTokenAsync(user, user.PhoneNumber);

                Console.WriteLine(token);

                UserVerificationViewModel verificationViewModel = new()
                {
                    PhoneNumber = user.PhoneNumber
                };
                return View("Verification", verificationViewModel);
            }
        }

        ModelState.AddModelError(string.Empty, identityResult.Errors.FirstOrDefault()?.Description);
        SetFirstError(ModelState, "SignUpError");

        return View("Index", viewModel);
    }

    public IActionResult Verification()
    {
        return View(new UserVerificationViewModel());
    }

    [HttpPost]
    public async Task<IActionResult> VerifyPhoneNumber(UserVerificationViewModel model)
    {
        if (string.IsNullOrEmpty(model.PhoneNumber) || string.IsNullOrEmpty(model.Token))
            return BadRequest();

        var user = _userManager.Users.FirstOrDefault(user => user.PhoneNumber.Equals(model.PhoneNumber));

        if (user is null)
            return BadRequest();

        bool isValid = await _userManager.VerifyChangePhoneNumberTokenAsync(user, model.Token, user.PhoneNumber);

        if (isValid)
        {
            user.PhoneNumberConfirmed = true;
            await _userManager.UpdateAsync(user);
            return RedirectToAction("Index", "Dashboard", new { area = "User" });
        }

        model.Token = string.Empty;
        ModelState.AddModelError(string.Empty, "کد وارد شده معتبر نمی‌باشد");
        SetFirstError(ModelState, "VerificationError");
        return View("Verification", model);
    }

    public void SetFirstError(ModelStateDictionary modelState, string key)
    {
         string? firstError = ModelState.Values
        .SelectMany(v => v.Errors)
        .Select(e => e.ErrorMessage)
        .FirstOrDefault();

        ViewData[key] = firstError;
    }
}