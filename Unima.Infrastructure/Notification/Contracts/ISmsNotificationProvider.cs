namespace Unima.Infrastructure.Notification.Contracts;

public interface ISmsNotificationProvider
{
    Task<bool> SendAsync(string text, string[] to);
}
