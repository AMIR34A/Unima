using Unima.Infrastructure.Notification;
using Unima.Infrastructure.Notification.Contracts;

namespace Unima.HelperClasses.ExtensionMethods;

public static class SmsNotificationConfiguration
{
    public static void ConfigSmsNotification(this IServiceCollection services)
    {
        var provider = NotificationCenter.ConfigSms();
        services.AddSingleton(typeof(ISmsNotificationProvider), provider);
    }
}
