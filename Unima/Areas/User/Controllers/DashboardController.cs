using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

namespace Unima.Areas.User.Controllers;

[Authorize]
[Area("User")]
public class DashboardController : Controller
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ISelfServiceBuilder _selfServiceBuilder;

    public DashboardController(UserManager<ApplicationUser> userManager, ISelfServiceBuilder selfServiceBuilder, IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
        _selfServiceBuilder = selfServiceBuilder;
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

        DashboardViewModel dashboardViewModel = new()
        {
            ReservedFoods = reservedFoods,
            Plans = plans,
            QuestionAndAnswers = questionAndAnswerModels,
            DayOfWeek = dayOfWeek
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

        SelfService? selfService = (await _selfServiceBuilder
            .WithCredentials(user.UserName, user.SelfServicePassword)
            .BuildAsync());

        return await selfService.GetBalance();
    }
}
