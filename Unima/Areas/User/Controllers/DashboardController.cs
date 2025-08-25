using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using Unima.Areas.Professor.Hubs;
using Unima.Areas.User.Models.Dashboard;
using Unima.Areas.User.Models.Plan;
using Unima.Areas.User.Models.Q_A;
using Unima.Areas.User.Models.User;
using Unima.Areas.User.Models.ViewModels;
using Unima.Biz.UoW;
using Unima.Dal.Entities;
using Unima.Dal.Entities.Entities;
using Unima.Dal.Entities.Models;
using Unima.Dal.Enums;
using Unima.HelperClasses.SelfService;
using Unima.Models.Api;

namespace Unima.Areas.User.Controllers;

[Authorize]
[Area("User")]
public class DashboardController : Controller
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ISelfServiceBuilder _selfServiceBuilder;
    private readonly IHubContext<StatusHub> _hubContext;

    public DashboardController(UserManager<ApplicationUser> userManager, ISelfServiceBuilder selfServiceBuilder, IUnitOfWork unitOfWork, IHubContext<StatusHub> hubContext)
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
        _selfServiceBuilder = selfServiceBuilder;
        _hubContext = hubContext;
    }

    public async Task<IActionResult> Index()
    {
        ApplicationUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser is null)
            return NotFound();

        IQueryable<FoodModel>? reservedFoods = _userManager.Users
            .Where(user => user.Id == currentUser.Id)
            .Include(user => user.UserFoods)
            .ThenInclude(userFood => userFood.Food)
            .SelectMany(user => user.UserFoods)
            .Select(userFood => new FoodModel
            {
                Title = userFood.Food.Title,
                Price = userFood.Food.Price,
                Day = userFood.Food.DayOfWeek,
                MealType = userFood.Food.MealType
            })
            .OrderBy(food => food.MealType);


        WeekDay dayOfWeek = DateTime.Now.DayOfWeek switch
        {
            DayOfWeek.Saturday => WeekDay.Saturday,
            DayOfWeek.Sunday => WeekDay.Sunday,
            DayOfWeek.Monday => WeekDay.Monday,
            DayOfWeek.Tuesday => WeekDay.Tuesday,
            DayOfWeek.Wednesday => WeekDay.Wednesday,
            DayOfWeek.Thursday => WeekDay.Thursday,
            _ => WeekDay.Friday
        };

        IEnumerable<PlanModel>? plans = (await _unitOfWork.RepositoryBase<Plan>().GetAllAsync())
                                        .Select(plan => new PlanModel
                                        {
                                            Title = plan.Title,
                                            Type = plan.Type,
                                            HasTelegramBot = plan.HasTelegramBot.HasValue && plan.HasTelegramBot.Value,
                                            HasSmsNotification = plan.HasSMSNotification.HasValue && plan.HasSMSNotification.Value,
                                            HasEmailNotification = plan.HasEmailNotification.HasValue && plan.HasEmailNotification.Value,
                                            CountOfMeal = plan.CountOfMeal,
                                            Period = plan.Period,
                                            Price = plan.Price
                                        });

        IEnumerable<QuestionAndAnswerModel> questionAndAnswerModels = (await _unitOfWork.RepositoryBase<QuestionAndAnswer>().GetAllAsync())
                                                                      .Select(qa => new QuestionAndAnswerModel
                                                                      {
                                                                          Question = qa.Question,
                                                                          Answer = qa.Answer,
                                                                          Priority = qa.Priority
                                                                      });


        IEnumerable<Professor.Models.ScheduleModel> schedules = _unitOfWork.RepositoryBase<Lesson>().Include(lesson => lesson.Schedules)
                                                                .Where(lesson => lesson.ProfessorId == currentUser.Id)
                                                                .SelectMany(lesson => lesson.Schedules)
                                                                .Select(schedule => new Professor.Models.ScheduleModel()
                                                                {
                                                                    LessonTitle = schedule.Lesson.Title,
                                                                    GroupNo = schedule.LessonGroupNo,
                                                                    RoomNo = schedule.RoomNo,
                                                                    DayOfWeek = schedule.DayOfWeek,
                                                                    DayTitle = string.Empty,
                                                                    WeekStatus = schedule.WeekStatus,
                                                                    Period = schedule.Period
                                                                }).AsEnumerable();

        IEnumerable<SelectListItem> professorOfficeStatuses = new List<SelectListItem>
        {
            new SelectListItem("در دسترس",((int)OfficeStatus.Available).ToString()),
            new SelectListItem("مزاحم نشوید",((int)OfficeStatus.Busy).ToString()),
            new SelectListItem("بزودی برمیگردم",((int)OfficeStatus.BeRightBack).ToString()),
            new SelectListItem("آفلاین",((int)OfficeStatus.Offline).ToString())
        };

        ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                           .FirstOrDefaultAsync(professor => professor.Id == currentUser.Id);

        DashboardViewModel dashboardViewModel = new()
        {
            ReservedFoods = reservedFoods,
            Plans = plans,
            QuestionAndAnswers = questionAndAnswerModels,
            Schedules = schedules,
            DayOfWeek = dayOfWeek,
            UserPlan = currentUser.Plan is not null ? currentUser.Plan.Title : "پلن خریداری نشده است",
            TodayDate = GetPersianDateTime(),
            ProfessorOfficeStatuses = professorOfficeStatuses,
            CurrentOfficeStatus = professor is not null ? professor.OfficeStatus : null
        };

        return View(dashboardViewModel);
    }

    [HttpGet]
    [Route("User/Dashboard/GetCredit")]
    public async Task<string> GetCredit()
    {
        ApplicationUser? user = await _userManager.GetUserAsync(User);

        if (user is null)
            return string.Empty;

        if (string.IsNullOrWhiteSpace(user.SelfServicePassword))
            return "ابتدا از داخل تنظیمات رمز عبور سامانه سلف را ثبت نمایید";

        ApiResult<SelfService>? selfService = (await _selfServiceBuilder
            .WithCredentials(user.UserName, user.SelfServicePassword)
            .BuildAsync());

        return selfService.IsSuccess ? await selfService.Data.GetBalance() : "خطایی در اتصال به سامانه سلف رخ داد";
    }

    [HttpGet]
    [Route("User/Dashboard/GetTimelineData")]
    public async Task<IActionResult> GetTimelineData()
    {
        ApplicationUser? currentUser = await _userManager.GetUserAsync(User);
        if (currentUser is null)
            return NotFound();

        var timelineData = _unitOfWork.RepositoryBase<Schedule>()
                                                                   .Include(schedule => schedule.Lesson)
                                                                   .Where(schedule => schedule.LessonProfessorId == currentUser.Id).AsEnumerable()
                                                                   .Select(schedule => new TimelineModel()
                                                                   {
                                                                       Title = schedule.Lesson.Title,
                                                                       DayOfWeek = schedule.DayOfWeek,
                                                                       Time = schedule.Period switch
                                                                       {
                                                                           TimePeriod.SixToEight => "06:00",
                                                                           TimePeriod.EightToTen => "08:00",
                                                                           TimePeriod.TenToTwelve => "10:00",
                                                                           TimePeriod.TwelveToFourteen => "12:00",
                                                                           TimePeriod.FourteenToSixteen => "14:00",
                                                                           TimePeriod.SixteenToEighteen => "16:00",
                                                                           TimePeriod.EightTeenToTwenty => "18:00",
                                                                           TimePeriod.TwentyToTwentyTwo => "20:00",
                                                                           _ => "00:00"
                                                                       }
                                                                   });
        return Ok(timelineData);
    }

    [HttpPost]
    [Route("User/Dashboard/UpdateOfficeStatus/{officeStatus:int}")]
    public async Task<IActionResult> UpdateOfficeStatus(OfficeStatus officeStatus)
    {
        ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

        if (currentUser is null)
            return NotFound();

        ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                           .FirstOrDefaultAsync(professor => professor.Id == currentUser.Id);
        if (professor is null)
            return NotFound();

        professor.OfficeStatus = officeStatus;
        await _unitOfWork.SaveAsync();
        await _hubContext.Clients.All.SendAsync("UpdateOfficeStatus", professor.OfficeNo, Enum.GetName(officeStatus));

        return Ok();
    }

    private string GetPersianDateTime()
    {
        PersianCalendar persianCalendar = new PersianCalendar();
        int year = persianCalendar.GetYear(DateTime.Now);
        int month = persianCalendar.GetMonth(DateTime.Now);
        int day = persianCalendar.GetDayOfMonth(DateTime.Now);

        return string.Format("{0}/{1}/{2}", year, month, day);
    }
}
