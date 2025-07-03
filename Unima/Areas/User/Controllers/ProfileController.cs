using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Unima.Areas.User.Models.Profile;
using Unima.Areas.User.Models.ViewModels;
using Unima.Biz.UoW;
using Unima.Dal.Entities;
using Unima.Dal.Entities.Models;
using Unima.Dal.Enums;

namespace Unima.Areas.User.Controllers
{
    [Area("User")]
    public class ProfileController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileController(UserManager<ApplicationUser> userManager, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
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
                    new SelectListItem("انتخاب کنید", "1" ,!currentUser.Gender.HasValue || currentUser.Gender.Value == Gender.NotSelected),
                    new SelectListItem("مرد","2",currentUser.Gender.HasValue && currentUser.Gender.Value == Gender.Male),
                    new SelectListItem("زن" , "3", currentUser.Gender.HasValue && currentUser.Gender.Value == Gender.Female)
                }
            });
        }

        [HttpGet]
        [Route("User/Profile/GetSelfLocationsData/{genderId:int?}")]
        public async Task<IActionResult> GetSelfLocationsDataAsync(int? genderId)
        {
            Gender gender = genderId.HasValue && genderId.Value != 1 ? (Gender)genderId : Gender.NotSelected;

            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return BadRequest();

            IEnumerable<SelectListItem> selfLocations;

            if (gender == Gender.NotSelected)
            {
                selfLocations = new List<SelectListItem>
                {
                    new SelectListItem("ابتدا جنسیت را مشخص کنید","0",true)
                };
            }
            else
            {
                selfLocations = (await _unitOfWork.RepositoryBase<SelfLocation>().GetAllAsync())
                                .Where(self => self.Gender == gender)
                                .Select(self => new SelectListItem(self.Title, self.Id.ToString(), currentUser.DefaultSelfLocationId.HasValue && currentUser.DefaultSelfLocationId == self.Id))
                                .DefaultIfEmpty(new SelectListItem("سلفی ثبت نشده است","-1"));
            }

            return Ok(new
            {
                SelfLocations = selfLocations,
            });
        }

        public async Task<IActionResult> Index()
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            ProfileModel profileModel = new()
            {
                FullName = currentUser.FullName,
                Username = currentUser.UserName,
                PhoneNumber = currentUser.PhoneNumber,
                Email = string.IsNullOrEmpty(currentUser.Email) ? "ثبت نشده" : currentUser.Email,
                //Gender = Gender.Male
            };

            ProfileViewModel viewModel = new ProfileViewModel
            {
                ProfileModel = profileModel
            };

            return View(viewModel);
        }
    }
}
