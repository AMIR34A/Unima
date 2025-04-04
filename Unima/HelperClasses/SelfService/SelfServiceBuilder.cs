using System.Net;

namespace Unima.HelperClasses.SelfService
{
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

        public async Task<SelfService> BuildAsync()
        {
            var selfService = new SelfService(_httpClientFactory);

            if (!string.IsNullOrEmpty(_username) && !string.IsNullOrEmpty(_password))
            {
                await selfService.LogIn(_username, _password);
            }

            return selfService;
        }
    }
}
