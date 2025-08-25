using Microsoft.AspNetCore.Mvc.Rendering;
using Unima.Areas.Professor.Models;
using Unima.Areas.User.Models.Plan;
using Unima.Areas.User.Models.Q_A;
using Unima.Areas.User.Models.User;
using Unima.Dal.Enums;

namespace Unima.Areas.User.Models.ViewModels;

public class DashboardViewModel
{
    public IQueryable<FoodModel>? ReservedFoods { get; set; }

    public IEnumerable<PlanModel>? Plans { get; set; }

    public IEnumerable<QuestionAndAnswerModel>? QuestionAndAnswers { get; set; }

    public IEnumerable<ScheduleModel>? Schedules { get; set; }

    public WeekDay DayOfWeek { get; set; }

    public string? UserPlan { get; set; }

    public required string TodayDate { get; set; }

    public IEnumerable<SelectListItem>? ProfessorOfficeStatuses { get; set; }

    public OfficeStatus? CurrentOfficeStatus { get; set; }
}