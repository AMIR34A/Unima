using Unima.Areas.Professor.Models.Status;

namespace Unima.Areas.Professor.Models.ViewModels;

public class StatusViewModel
{
    public IEnumerable<OfficeModel> LeftOffices { get; set; }

    public IEnumerable<OfficeModel> RightOffices { get; set; }
}