using Unima.Dal.Enums;

namespace Unima.Dal.Entities.Entities;

public class SystemSetting
{
    public bool IsSignUpEnabled { get; set; }

    public bool IsLogInEnabled { get; set; }

    public bool IsReservationEnabled { get; set; }

    public SmsNotificationProvider SmsNotificationProvider { get; set; }
}