using Unima.Infrastructure.Notification.Contracts;

namespace Unima.Infrastructure.Notification.Providers;

internal class KavenegarSmsNotificationProvider : ISmsNotificationProvider
{
    public Task<bool> SendAsync(string text, string[] to)
    {
        throw new NotImplementedException();
    }
}
