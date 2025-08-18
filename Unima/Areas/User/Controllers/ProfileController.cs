using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Mono.TextTemplating;
using System.Text.RegularExpressions;
using Unima.Areas.Professor.Models;
using Unima.Areas.User.Models.Profile;
using Unima.Areas.User.Models.Q_A;
using Unima.Areas.User.Models.ViewModels;
using Unima.Biz.UoW;
using Unima.Dal.Entities;
using Unima.Dal.Entities.Entities;
using Unima.Dal.Entities.Models;
using Unima.Dal.Enums;
using Unima.HelperClasses.ExtensionMethods;

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

        [Route("User/Profile/GetLessons")]
        public async Task<IActionResult> GetLessons()
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            var lessons = _unitOfWork.RepositoryBase<Lesson>().Include(lesson => lesson.Department)
                                                                                               .Where(lesson => lesson.ProfessorId == currentUser.Id)
                                                                                               .Select(lesson => new
                                                                                               {
                                                                                                   Id = $"{lesson.No}{lesson.GroupNo}",
                                                                                                   Value = lesson.Title,
                                                                                                   No = lesson.No,
                                                                                                   DepartmentTitle = lesson.Department.Title
                                                                                               });

            return Ok(lessons);
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

            IEnumerable<LessonModel> lessons = (await _unitOfWork.RepositoryBase<Lesson>().GetAllAsync(lesson => lesson.ProfessorId == currentUser.Id))
                                                                 .Select(lesson => new LessonModel
                                                                 {
                                                                     Title = lesson.Title,
                                                                     No = lesson.No,
                                                                     GroupNo = lesson.GroupNo,
                                                                     DepartmentId = lesson.DepartmentId
                                                                 });

            IEnumerable<LocationModel> locations = (await _unitOfWork.RepositoryBase<Dal.Entities.Entities.Location>().GetAllAsync(location => location.ProfessorId == currentUser.Id))
                                                                     .Select(location => new LocationModel()
                                                                     {
                                                                         Id = location.Id,
                                                                         Title = location.Title,
                                                                         Address = location.Address,
                                                                         GoogleMapLink = location.GoogleMapLink
                                                                     }).AsEnumerable();

            IEnumerable<string> faculties = (await _unitOfWork.RepositoryBase<Faculty>().GetAllAsync())
                                                               .Select(facility => facility.Title);

            IEnumerable<DepartmentModel> departments = (await _unitOfWork.RepositoryBase<Department>().GetAllAsync())
                                                                         .Select(department => new DepartmentModel()
                                                                         {
                                                                             Id = department.Id,
                                                                             Title = department.Title
                                                                         });
            ProfileViewModel viewModel = new ProfileViewModel
            {
                ProfileModel = profileModel,
                QuestionAndAnswers = questionAndAnswerModels,
                Lessons = lessons,
                Locations = locations,
                Faculties = faculties,
                Departments = departments
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

        [HttpPost]
        [Route("User/Profile/AddLesson")]
        public async Task<IActionResult> AddLesson([FromBody] LessonModel lessonModel)
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                               .FirstOrDefaultAsync(professor => professor.Id == currentUser.Id);

            Department? department = await _unitOfWork.RepositoryBase<Department>().FirstOrDefaultAsync(department => department.Id == lessonModel.DepartmentId);

            if (professor is null || department is null)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState.FirstError());

            bool isExsist = await _unitOfWork.RepositoryBase<Lesson>().AnyAsync(lesson => lesson.ProfessorId == professor.Id && lesson.No == lessonModel.No && lesson.GroupNo == lessonModel.GroupNo);
            if (isExsist)
            {
                ModelState.AddModelError("DuplicateLesson", "درس تکراری می‌باشد");
                return BadRequest(ModelState);
            }

            await _unitOfWork.RepositoryBase<Lesson>().AddAsync(new()
            {
                Title = lessonModel.Title,
                No = lessonModel.No,
                GroupNo = lessonModel.GroupNo,
                ProfessorId = professor.Id,
                Professor = professor,
                DepartmentId = lessonModel.DepartmentId,
                Department = department
            });
            await _unitOfWork.SaveAsync();

            return Ok();
        }

        [HttpPut]
        [Route("User/Profile/UpdateLesson/{lessonId:int?}")]
        public async Task<IActionResult> UpdateLesson(int? lessonId, [FromBody] LessonModel lessonModel)
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                               .FirstOrDefaultAsync(professor => professor.Id == currentUser.Id);

            if (professor is null)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState.FirstError());


            string concatedNoAndGroupNo = lessonId.HasValue ? lessonId.ToString() : string.Empty;

            Lesson? lesson = (await _unitOfWork.RepositoryBase<Lesson>()
                                               .GetAllAsync(lesson => lesson.ProfessorId == professor.Id))
                                               .Where(lesson => string.Equals($"{lesson.No}{lesson.GroupNo}", concatedNoAndGroupNo))
                                               .FirstOrDefault();

            if (lesson is null)
            {
                ModelState.AddModelError("LessonNotFound", "درسی برای آپدیت کردن یافت نشد");
                return BadRequest(ModelState);
            }

            lesson.Title = lessonModel.Title;
            lesson.DepartmentId = lessonModel.DepartmentId;

            _unitOfWork.RepositoryBase<Lesson>().Update(lesson);
            await _unitOfWork.SaveAsync();

            return Ok();
        }

        [HttpDelete]
        [Route("User/Profile/DeleteLesson/{lessonId:int?}")]
        public async Task<IActionResult> DeleteLesson(int? lessonId)
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                               .FirstOrDefaultAsync(professor => professor.Id == currentUser.Id);

            if (professor is null)
                return NotFound();

            if (!lessonId.HasValue)
                return NotFound();


            string concatedNoAndGroupNo = lessonId.HasValue ? lessonId.ToString() : string.Empty;

            Lesson? lesson = (await _unitOfWork.RepositoryBase<Lesson>()
                                               .GetAllAsync())
                                              .FirstOrDefault(lesson => lesson.ProfessorId == professor.Id && string.Equals($"{lesson.No}{lesson.GroupNo}", concatedNoAndGroupNo));

            if (lesson is null)
            {
                ModelState.AddModelError("LessonNotFound", "مکانی برای حذف کردن یافت نشد");
                return BadRequest(ModelState);
            }

            _unitOfWork.RepositoryBase<Lesson>().Delete(lesson);
            await _unitOfWork.SaveAsync();

            return Ok();
        }

        [HttpPost]
        [Route("User/Profile/AddLocation")]
        public async Task<IActionResult> AddLocation([FromBody] LocationModel locationModel)
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                               .FirstOrDefaultAsync(professor => professor.Id == currentUser.Id);

            if (professor is null)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState.FirstError());

            Dal.Entities.Entities.Location location = new()
            {
                Title = locationModel.Title,
                Address = locationModel.Address,
                GoogleMapLink = locationModel.GoogleMapLink,
                ProfessorId = professor.Id,
                Professor = professor
            };

            await _unitOfWork.RepositoryBase<Dal.Entities.Entities.Location>().AddAsync(location);
            await _unitOfWork.SaveAsync();

            return Ok(new { Id = location.Id });
        }

        [HttpPut]
        [Route("User/Profile/UpdateLocation")]
        public async Task<IActionResult> UpdateLocation([FromBody] LocationModel locationModel)
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                               .FirstOrDefaultAsync(professor => professor.Id == currentUser.Id);

            if (professor is null)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState.FirstError());


            Dal.Entities.Entities.Location? location = (await _unitOfWork.RepositoryBase<Dal.Entities.Entities.Location>()
                                                                         .FirstOrDefaultAsync(location => location.Id == locationModel.Id));

            if (location is null)
            {
                ModelState.AddModelError("LessonNotFound", "مکانی برای آپدیت کردن یافت نشد");
                return BadRequest(ModelState);
            }

            location.Title = locationModel.Title;
            location.Address = locationModel.Address;
            location.GoogleMapLink = locationModel.GoogleMapLink;

            _unitOfWork.RepositoryBase<Dal.Entities.Entities.Location>().Update(location);
            await _unitOfWork.SaveAsync();

            return Ok();
        }

        [HttpDelete]
        [Route("User/Profile/DeleteLocation/{locationId:int?}")]
        public async Task<IActionResult> DeleteLocation(int? locationId)
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                               .FirstOrDefaultAsync(professor => professor.Id == currentUser.Id);

            if (!locationId.HasValue)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState.FirstError());

            Dal.Entities.Entities.Location? location = (await _unitOfWork.RepositoryBase<Dal.Entities.Entities.Location>()
                                                                         .FirstOrDefaultAsync(location => location.Id == locationId));

            if (location is null)
            {
                ModelState.AddModelError("LessonNotFound", "مکانی برای حذف کردن یافت نشد");
                return BadRequest(ModelState);
            }

            _unitOfWork.RepositoryBase<Dal.Entities.Entities.Location>().Delete(location);
            await _unitOfWork.SaveAsync();

            return Ok();
        }

        [HttpGet]
        [Route("/User/Profile/GetSchedule")]
        public async Task<IActionResult> GetScheduele()
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            IEnumerable<Professor.Models.ScheduleModel> schedules = _unitOfWork.RepositoryBase<Lesson>().Include(lesson => lesson.Schedules)
                                                                               .Where(lesson => lesson.ProfessorId == currentUser.Id).SelectMany(lesson => lesson.Schedules)
                                                                               .Select(schedule => new Professor.Models.ScheduleModel()
                                                                               {
                                                                                   LessonTitle = schedule.Lesson.Title,
                                                                                   GroupNo = schedule.LessonGroupNo,
                                                                                   RoomNo = schedule.RoomNo,
                                                                                   DayOfWeek = schedule.DayOfWeek,
                                                                                   DayTitle = string.Empty,
                                                                                   WeekStatus = schedule.WeekStatus,
                                                                                   Period = schedule.Period,
                                                                                   LessonId = $"{schedule.LessonNo}{schedule.LessonGroupNo}",
                                                                                   Faculty = schedule.Address
                                                                               }).AsEnumerable();
            return Ok(schedules);
        }

        [HttpPost]
        [Route("User/Profile/AddSchedule/{lessonId:int}")]
        public async Task<IActionResult> AddSchedule(int lessonId, [FromBody] Models.Profile.ScheduleModel scheduleModel)
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                               .FirstOrDefaultAsync(professor => professor.Id == currentUser.Id);
            if (professor is null)
                return NotFound();

            Lesson? lesson = (await _unitOfWork.RepositoryBase<Lesson>()
                                               .GetAllAsync(lesson => lesson.ProfessorId == professor.Id))
                                               .FirstOrDefault(lesson => string.Equals($"{lesson.No}{lesson.GroupNo}", lessonId.ToString()));

            if (lesson is null)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState.FirstError());

            bool isExsist = await _unitOfWork.RepositoryBase<Schedule>().AnyAsync(schedule => schedule.LessonProfessorId == professor.Id && schedule.Period == (TimePeriod)scheduleModel.Period && schedule.DayOfWeek == (WeekDay)scheduleModel.DayOfWeek && (schedule.WeekStatus == (WeekStatus)scheduleModel.WeekStatus || schedule.WeekStatus == WeekStatus.Fixed));
            if (isExsist)
            {
                ModelState.AddModelError("Conflict", "تداخل وجود دارد");
                return BadRequest(ModelState);
            }

            await _unitOfWork.RepositoryBase<Schedule>().AddAsync(new()
            {
                DayOfWeek = (WeekDay)scheduleModel.DayOfWeek,
                WeekStatus = (WeekStatus)scheduleModel.WeekStatus,
                RoomNo = scheduleModel.RoomNo,
                Period = (TimePeriod)scheduleModel.Period,
                Address = scheduleModel.Faculty,
                LessonProfessorId = professor.Id,
                LessonNo = lesson.No,
                LessonGroupNo = lesson.GroupNo,
                Lesson = lesson
            });
            await _unitOfWork.SaveAsync();

            return Ok();
        }

        [HttpPut]
        [Route("User/Profile/UpdateSchedule/{lessonId:int}")]
        public async Task<IActionResult> UpdateSchedule(int lessonId, [FromBody] Models.Profile.ScheduleModel scheduleModel)
        {
            ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

            if (currentUser is null)
                return NotFound();

            ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                               .FirstOrDefaultAsync(professor => professor.Id == currentUser.Id);
            if (professor is null)
                return NotFound();

            Lesson? lesson = (await _unitOfWork.RepositoryBase<Lesson>()
                                   .GetAllAsync(lesson => lesson.ProfessorId == professor.Id))
                                   .FirstOrDefault(lesson => string.Equals($"{lesson.No}{lesson.GroupNo}", lessonId.ToString()));

            if (lesson is null)
                return NotFound();

            Schedule? selectedSchedule = await _unitOfWork.RepositoryBase<Schedule>()
                                                          .FirstOrDefaultAsync(schedule => schedule.LessonProfessorId == professor.Id && schedule.LessonNo == lesson.No && schedule.LessonGroupNo == lesson.GroupNo && schedule.DayOfWeek == (WeekDay)scheduleModel.DayOfWeek && schedule.Period == (TimePeriod)scheduleModel.Period && schedule.WeekStatus == (WeekStatus)scheduleModel.OldWeekStatus);

            if (selectedSchedule is null)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState.FirstError());

            _unitOfWork.RepositoryBase<Schedule>().Delete(selectedSchedule);

            await _unitOfWork.SaveAsync();

            Schedule schedule = new()
            {
                DayOfWeek = (WeekDay)scheduleModel.DayOfWeek,
                WeekStatus = (WeekStatus)scheduleModel.WeekStatus,
                RoomNo = scheduleModel.RoomNo,
                Period = (TimePeriod)scheduleModel.Period,
                Address = scheduleModel.Faculty,
                LessonProfessorId = professor.Id,
                LessonNo = lesson.No,
                LessonGroupNo = lesson.GroupNo,
                Lesson = lesson
            };

            bool isExsist = await _unitOfWork.RepositoryBase<Schedule>().AnyAsync(schedule => schedule.LessonProfessorId == professor.Id && schedule.Period == (TimePeriod)scheduleModel.Period && schedule.DayOfWeek == (WeekDay)scheduleModel.DayOfWeek && (schedule.WeekStatus == (WeekStatus)scheduleModel.WeekStatus || schedule.WeekStatus == WeekStatus.Fixed));
            if (isExsist)
            {
                schedule.WeekStatus = (WeekStatus)scheduleModel.OldWeekStatus;
                ModelState.AddModelError("Conflict", "تداخل وجود دارد");
            }

            await _unitOfWork.RepositoryBase<Schedule>().AddAsync(schedule);
            await _unitOfWork.SaveAsync();

            return isExsist ? BadRequest(ModelState) : Ok();
        }
    }
}