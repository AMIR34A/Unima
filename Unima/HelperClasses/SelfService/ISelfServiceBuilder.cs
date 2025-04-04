namespace Unima.HelperClasses.SelfService
{
    public interface ISelfServiceBuilder
    {
        SelfServiceBuilder WithCredentials(string username, string password);
    }
}
