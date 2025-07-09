namespace Unima.Dal.Entities.Entities;

public class QuestionAndAnswer
{
    public int Id { get; set; }

    public required string Question { get; set; }

    public required string Answer { get; set; }

    public required byte Priority { get; set; }
}