using Unima.Areas.User.Models.Profile;
using Unima.Areas.User.Models.Q_A;

namespace Unima.Areas.User.Models.ViewModels;

public class ProfileViewModel
{
    public required ProfileModel ProfileModel { get; set; }

    public IEnumerable<QuestionAndAnswerModel>? QuestionAndAnswers { get; set; }
}