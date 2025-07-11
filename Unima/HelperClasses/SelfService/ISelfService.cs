namespace Unima.HelperClasses.SelfService
{
    public interface ISelfService
    {
        Task<bool> LogIn(string username, string password);

        Task<string> GetBalance();
    }
}
