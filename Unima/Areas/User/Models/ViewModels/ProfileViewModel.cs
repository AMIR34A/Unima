using Unima.Areas.User.Models.Profile;
using Unima.Areas.User.Models.Q_A;
using ScheduleModel = Unima.Areas.Professor.Models.ScheduleModel;

namespace Unima.Areas.User.Models.ViewModels;

public class ProfileViewModel
{
    public required ProfileModel ProfileModel { get; set; }

    public IEnumerable<QuestionAndAnswerModel>? QuestionAndAnswers { get; set; }

    public IEnumerable<LessonModel>? Lessons { get; set; }

    public IEnumerable<LocationModel>? Locations { get; set; }

    public IEnumerable<string>? Faculties { get; set; }

    public IEnumerable<DepartmentModel>? Departments { get; set; }

    public SocialMediaModel SocialMedia { get; set; }

    public string? Biography { get; set; }
}