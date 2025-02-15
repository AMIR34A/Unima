using Unima.Dal.Entities.Models.Support;
using Unima.Models.Account;

namespace Unima.Models.ViewModels;

public class AccountViewModel
{
    public List<Support>? Supports { get; set; }

    public UserRegisterModel UserRegisterModel { get; set; }
}
