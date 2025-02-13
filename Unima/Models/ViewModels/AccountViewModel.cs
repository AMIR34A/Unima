using Unima.Dal.Entities.Models.Support;

namespace Unima.Models.ViewModels;

public class AccountViewModel
{
    public ICollection<Support>? Supports { get; set; }

}
