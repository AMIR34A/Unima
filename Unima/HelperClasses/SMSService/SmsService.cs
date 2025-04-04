using Kavenegar;
using Kavenegar.Core.Models;

namespace Unima.HelperClasses.SMSService;

public class SmsService : ISmsService
{
    private readonly KavenegarApi _api;

    public SmsService(KavenegarApi api) => _api = api;

    public async Task<bool> SendAsync(string phoneNumber)
    {
        SendResult? result = await _api.Send("", "", "");

        return result.Status == 200;
    }
}
