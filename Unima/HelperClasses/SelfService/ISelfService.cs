namespace Unima.HelperClasses.SelfService
{
    public interface ISelfService
    {
        Task LogIn(string username, string password);

        Task<string> GetBalance();
    }
}
