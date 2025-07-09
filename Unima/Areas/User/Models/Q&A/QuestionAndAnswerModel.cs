namespace Unima.Areas.User.Models.Q_A;

public class QuestionAndAnswerModel
{
    public required string Question { get; set; }

    public required string Answer { get; set; }

    public required byte Priority { get; set; }
}