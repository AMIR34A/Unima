namespace Unima.HelperClasses.SMSService;

public interface ISmsService
{
    Task<bool> SendAsync(string phoneNumber);
}
