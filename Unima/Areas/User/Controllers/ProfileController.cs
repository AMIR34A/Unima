using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Unima.Areas.User.Models.Profile;
using Unima.Areas.User.Models.ViewModels;
using Unima.Dal.Entities;

namespace Unima.Areas.User.Controllers
{
    [Area("User")]
    public class ProfileController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ProfileController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        [Route("User/Profile/GetGenderData")]
        public async Task<IActionResult> GetGenderDataAsync()
        {
            return Ok(new
            {
                Gender = new List<SelectListItem>
                {
                    new SelectListItem("مرد","1"),
                    new SelectListItem("زن" , "2"),
                }
            });
        }

        [HttpGet]
        [Route("User/Profile/GetSelfLocationsData/{genderId:int?}")]
        public async Task<IActionResult> GetSelfLocationsDataAsync(int? genderId)
        {
            List<SelectListItem> selfLocations;

            if (genderId == 1)
            {
                ApplicationUser? currentUser = await _userManager.GetUserAsync(User);


            }

            if (genderId == 1)
            {
                selfLocations = new List<SelectListItem>
                {
                    new SelectListItem("مرکزی","1"),
                    new SelectListItem("ابوذر" , "2"),
                    new SelectListItem("امیرآباد" , "3"),
                };
            }
            else
            {
                selfLocations = new List<SelectListItem>
                {
                    new SelectListItem("صدف","1"),
                    new SelectListItem("توحید" , "2"),
                };
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
                Email = string.IsNullOrEmpty(currentUser.Email) ? "ثبت نشده" : currentUser.Email
            };

            ProfileViewModel viewModel = new ProfileViewModel
            {
                ProfileModel = profileModel
            };

            return View(viewModel);
        }
    }
}
