using Unima.Models.Api;

namespace Unima.HelperClasses.SelfService;

public class SelfServiceBuilder : ISelfServiceBuilder
{
    private readonly IHttpClientFactory _httpClientFactory;
    private string _username;
    private string _password;

    public SelfServiceBuilder(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }


    public SelfServiceBuilder WithCredentials(string username, string password)
    {
        _username = username;
        _password = password;
        return this;
    }

    public async Task<ApiResult<SelfService>> BuildAsync()
    {
        var selfService = new SelfService(_httpClientFactory);

        bool result = false;
        if (!string.IsNullOrEmpty(_username) && !string.IsNullOrEmpty(_password))
        {
            result = await selfService.LogIn(_username, _password);
            return new ApiResult<SelfService>(result, StatusCode.OK, string.Empty, selfService);
        }

        return new ApiResult<SelfService>(false, StatusCode.InternalServerError, "خطایی در اتصال به سامانه سلف رخ داد", null);
    }
}
