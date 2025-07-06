using Unima.Biz.UoW;
using Unima.Infrastructure.Notification.Contracts;
using Unima.Infrastructure.Notification.Providers;

namespace Unima.Infrastructure.Notification;

public class NotificationCenter
{
    private readonly IUnitOfWork _unitOfWork;

    public NotificationCenter(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public static ISmsNotificationProvider ConfigSms()
    {
        return new KavenegarSmsNotificationProvider();
    }
}