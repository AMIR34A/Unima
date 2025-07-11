using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using Unima.Areas.User.Models.Profile;
using Unima.Areas.User.Models.Q_A;
using Unima.Areas.User.Models.ViewModels;
using Unima.Biz.UoW;
using Unima.Dal.Entities;
using Unima.Dal.Entities.Entities;
using Unima.Dal.Entities.Models;
using Unima.Dal.Enums;

namespace Unima.Areas.User.Controllers
{
    [Area("User")]
    public class ProfileController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        public ProfileController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpGet]
        [Route("User/Profile/GetGenderData")]
        public async Task<IActionResult> GetGenderDataAsync()
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return BadRequest();

            return Ok(new
            {
                Gender = new List<SelectListItem>
                {
                    new SelectListItem("مرد","1",currentUser.Gender.HasValue && currentUser.Gender.Value == Gender.Male),
                    new SelectListItem("زن" , "2", currentUser.Gender.HasValue && currentUser.Gender.Value == Gender.Female)
                }
            });
        }

        [HttpGet]
        [Route("User/Profile/GetSelfLocationsData")]
        public async Task<IActionResult> GetSelfLocationsDataAsync()
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            var maleSelfLocations = (await _unitOfWork.RepositoryBase<SelfLocation>().GetAllAsync())
                          .Where(self => self.Gender == Gender.Male)
                          .Select(self => new SelectListItem(self.Title, self.Id.ToString(), currentUser.DefaultSelfLocationId.HasValue && currentUser.DefaultSelfLocationId == self.Id))
                          .DefaultIfEmpty(new SelectListItem("سلفی ثبت نشده است", "0"));

            var femaleSelfLocations = (await _unitOfWork.RepositoryBase<SelfLocation>().GetAllAsync())
                          .Where(self => self.Gender == Gender.Female)
                          .Select(self => new SelectListItem(self.Title, self.Id.ToString(), currentUser.DefaultSelfLocationId.HasValue && currentUser.DefaultSelfLocationId == self.Id))
                          .DefaultIfEmpty(new SelectListItem("سلفی ثبت نشده است", "0"));
            return Ok(new
            {
                MaleSelfLocations = maleSelfLocations,
                FemaleSelfLocations = femaleSelfLocations
            });
        }

        public async Task<IActionResult> Index()
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            string defaultSelfService = currentUser.DefaultSelfLocationId.HasValue ?
                                        (await _unitOfWork.RepositoryBase<SelfLocation>().GetAllAsync()).FirstOrDefault(self => self.Id == currentUser.DefaultSelfLocationId.Value)?.Title :
                                        "ثبت نشده";

            ProfileModel profileModel = new()
            {
                FullName = currentUser.FullName,
                Username = currentUser.UserName,
                PhoneNumber = currentUser.PhoneNumber,
                Email = string.IsNullOrEmpty(currentUser.Email) ? "ثبت نشده" : currentUser.Email,
                Gender = !currentUser.Gender.HasValue || currentUser.Gender.Value == Gender.NotSelected ? "ثبت نشده" : currentUser.Gender.Value == Gender.Male ? "مرد" : "زن",
                DefaultSelfService = defaultSelfService,
                SelfServicePassword = currentUser.SelfServicePassword
            };


            IEnumerable<QuestionAndAnswerModel> questionAndAnswerModels = (await _unitOfWork.RepositoryBase<QuestionAndAnswer>().GetAllAsync())
                                                                          .Select(qa => new QuestionAndAnswerModel
                                                                          {
                                                                              Question = qa.Question,
                                                                              Answer = qa.Answer,
                                                                              Priority = qa.Priority
                                                                          });

            ProfileViewModel viewModel = new ProfileViewModel
            {
                ProfileModel = profileModel,
                QuestionAndAnswers = questionAndAnswerModels
            };

            return View(viewModel);
        }

        [HttpPost]
        [Route("Users/Profile/UpdateFullName")]
        public async Task<IActionResult> UpdateFullName([FromForm] string fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName) || fullName.Length < 3 || fullName.Length > 20)
            {
                ModelState.AddModelError("FullName", "طول نام و نام خانوادگی باید بزرگتر از 2 و کوچکتر از 20 باشد");
                return BadRequest(ModelState);
            }

            string[]? splitFullName = fullName.Split(' ');
            if (splitFullName.Length < 2)
            {
                ModelState.AddModelError("FullName", "نام و نام خانوادگی خود را کامل وارد کنید");
                return BadRequest(ModelState);
            }

            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            currentUser.FullName = fullName;
            return (await _userManager.UpdateAsync(currentUser)).Succeeded ? Ok() : BadRequest();
        }

        [HttpPost]
        [Route("Users/Profile/UpdateEmail")]
        public async Task<IActionResult> UpdateEmail([FromForm] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                ModelState.AddModelError("Email", "ایمیل را خود را وارد کنید");
                return BadRequest(ModelState);
            }

            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!Regex.Match(email, pattern).Success)
            {
                ModelState.AddModelError("Email", "ایمیل وارد شده معتبر نمی‌باشد");
                return BadRequest(ModelState);
            }

            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            IdentityResult? identityResult = await _userManager.SetEmailAsync(currentUser, email);

            if (!identityResult.Succeeded)
            {
                ModelState.AddModelError("Email", identityResult.Errors.FirstOrDefault()?.Description);
                return BadRequest(ModelState);
            }

            if (currentUser.EmailConfirmed)
                return Ok();

            currentUser.EmailConfirmed = true;
            return (await _userManager.UpdateAsync(currentUser)).Succeeded ? Ok() : BadRequest();
        }

        [HttpPost]
        [Route("Users/Profile/UpdatePhoneNumber")]
        public async Task<IActionResult> UpdatePhoneNumber([FromForm] string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
            {
                ModelState.AddModelError("PhoneNumber", "شماره موبایل همراه خود را وارد کنید");
                return BadRequest(ModelState);
            }

            string pattern = @"^09\d{9}$";
            if (!Regex.Match(phoneNumber, pattern).Success)
            {
                ModelState.AddModelError("PhoneNumber", "شماره موبایل وارد شده معتبر نمی‌باشد");
                return BadRequest(ModelState);
            }

            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            if (await _userManager.Users.AnyAsync(user => user.Id == currentUser.Id && user.PhoneNumber.Equals(phoneNumber)))
            {
                ModelState.AddModelError("PhoneNumber", "این شماره موبایل متعلق به شخص دیگری می‌باشد");
                return BadRequest(ModelState);
            }

            string token = await _userManager.GenerateChangePhoneNumberTokenAsync(currentUser, phoneNumber);

            Console.WriteLine(token);

            return string.IsNullOrEmpty(token) ? BadRequest() : Ok(token);
        }

        [HttpPost]
        [Route("Users/Profile/VerifyPhoneNumber")]
        public async Task<IActionResult> VerifyPhoneNumber(string phoneNumber, string token)
        {
            if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(phoneNumber))
            {
                ModelState.AddModelError("VerificationCode", "کد شش رقمی ارسال شده به شماره همراه خود را وارد کنید");
                return BadRequest(ModelState);
            }

            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            IdentityResult? identityResult = await _userManager.ChangePhoneNumberAsync(currentUser, phoneNumber, token);

            if (!identityResult.Succeeded)
            {
                ModelState.AddModelError("VerificationCode", identityResult.Errors.FirstOrDefault()?.Description);
                return BadRequest(ModelState);
            }

            return Ok();
        }

        [HttpPost]
        [Route("Users/Profile/UpdatePersonalInformation")]
        public async Task<IActionResult> UpdatePersonalInformation([FromForm] int gender, [FromForm] int defaultSelfLocation)
        {
            if (gender == 0 || defaultSelfLocation == 0)
            {
                ModelState.AddModelError("PersonalInformation", "جنسیت و سلف پیش فرض را انتخاب کنید");
                return BadRequest(ModelState);
            }

            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            currentUser.Gender = (Gender)gender;
            currentUser.DefaultSelfLocationId = defaultSelfLocation;

            return (await _userManager.UpdateAsync(currentUser)).Succeeded ? Ok() : BadRequest();
        }

        [HttpPost]
        [Route("Users/Profile/UpdatePassword")]
        public async Task<IActionResult> UpdatePassword(string currentPassword, string newPassword, string confirmNewPassword)
        {
            if (string.IsNullOrWhiteSpace(currentPassword) || string.IsNullOrWhiteSpace(newPassword) || string.IsNullOrWhiteSpace(confirmNewPassword))
            {
                ModelState.AddModelError("Password", "تمام فیلدها باید به درستی پر شوند");
                return BadRequest(ModelState);
            }

            if (!string.Equals(newPassword, confirmNewPassword))
            {
                ModelState.AddModelError("Password", "رمز عبور جدید و تکرار آن یکسان نمی‌باشند");
                return BadRequest(ModelState);
            }

            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            IdentityResult? identityResult = await _userManager.ChangePasswordAsync(currentUser, currentPassword, newPassword);
            if (!identityResult.Succeeded)
            {
                ModelState.AddModelError("Password", identityResult.Errors.FirstOrDefault()?.Description);
                return BadRequest(ModelState);
            }

            await _signInManager.SignOutAsync();

            return Ok();
        }

        [HttpPost]
        [Route("Users/Profile/UpdateStudentInformation")]
        public async Task<IActionResult> UpdateStudentInformation(string username, string selfPassword)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(selfPassword))
            {
                ModelState.AddModelError("Password", "تمام فیلدها باید به درستی پر شوند");
                return BadRequest(ModelState);
            }

            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            currentUser.SelfServicePassword = selfPassword;
            IdentityResult? identityResult = await _userManager.SetUserNameAsync(currentUser, username);
            if (!identityResult.Succeeded)
            {
                ModelState.AddModelError("StudentInformation", identityResult.Errors.FirstOrDefault()?.Description);
                return BadRequest(ModelState);
            }

            return Ok(); ;
        }
    }
}