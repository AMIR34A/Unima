using HtmlAgilityPack;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;

namespace Unima.HelperClasses.SelfService
{
    public class SelfService : ISelfService
    {
        private static Dictionary<string, string> _neededCookies;
        private readonly HttpClient _httpClient;
        private readonly CookieContainer _cookieContainer;

        public SelfService(IHttpClientFactory httpClientFactory)
        {
            _cookieContainer = new CookieContainer();
            _httpClient = httpClientFactory.CreateClient();
        }

        public async Task LogIn(string username, string password)
        {
            HttpRequestMessage request = ConfigHttpRequest(HttpMethod.Get, "https://selfservice.birjand.ac.ir");
            HttpResponseMessage response = await _httpClient.SendAsync(request);

            string? responseBody = await response.Content.ReadAsStringAsync();
            string regexPattern = @"idsrv.xsrf&quot;,&quot;value&quot;:&quot;([\w-]+)&quot;";
            var bodyXsrf = Regex.Match(responseBody, regexPattern).Groups[1].Value;

            //var captchaCookie = _handler.CookieContainer.GetCookies(new Uri("https://selfservice.birjand.ac.ir"))
            //    .Cast<Cookie>()
            //    .ToDictionary(cookie => cookie.Name, cookie => cookie.Value);

            //HttpRequestMessage captchaRequest = ConfigHttpRequest(HttpMethod.Get,
            //    "https://selfservice.birjand.ac.ir/api/v0/Captcha?id=11215188",
            //    captchaCookie,
            //    "", "", response.RequestMessage.RequestUri.AbsoluteUri);

            //HttpResponseMessage captchaResponse = await _httpClient.SendAsync(captchaRequest);
            //var captchaBytes = await captchaResponse.Content.ReadAsByteArrayAsync();
            //string captchaPath = Path.Combine(Environment.CurrentDirectory, "captcha.jpg");
            //await File.WriteAllBytesAsync(captchaPath, captchaBytes);
            //string captchaCode = await SolveCaptcha(captchaPath);

            var loginCookies = _cookieContainer.GetCookies(new Uri(response.RequestMessage.RequestUri.AbsoluteUri))
                .Cast<Cookie>()
                .ToDictionary(cookie => cookie.Name, cookie => cookie.Value);

            HttpRequestMessage loginRequest = ConfigHttpRequest(HttpMethod.Post, response.RequestMessage.RequestUri.AbsoluteUri,
                loginCookies, $"idsrv.xsrf={bodyXsrf}&username={username}&password={password}", "application/x-www-form-urlencoded");

            HttpResponseMessage loginResponse = await _httpClient.SendAsync(loginRequest);
            string loginResponseStr = await loginResponse.Content.ReadAsStringAsync();

            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(loginResponseStr);
            var inputNodes = doc.DocumentNode.SelectNodes("//input");

            StringBuilder dataStr = new StringBuilder();

            foreach (var input in inputNodes)
            {
                string inputName = input.GetAttributeValue("name", "");
                string inputValue = input.GetAttributeValue("value", "");
                dataStr.Append($"{inputName}={inputValue}&");
            }
            dataStr.Remove(dataStr.Length - 1, 1);

            HttpRequestMessage finalRequest = ConfigHttpRequest(HttpMethod.Post, "https://selfservice.birjand.ac.ir",
                loginCookies,
                dataStr.ToString(),
                "application/x-www-form-urlencoded");

            HttpResponseMessage finalResponse = await _httpClient.SendAsync(finalRequest);
            _neededCookies = _cookieContainer.GetCookies(new Uri("https://selfservice.birjand.ac.ir"))
                             .Cast<Cookie>()
                             .ToDictionary(cookie => cookie.Name, cookie => cookie.Value);
        }

        public async Task<string> GetBalance()
        {
            HttpRequestMessage balanceRequest = ConfigHttpRequest(HttpMethod.Get, "https://selfservice.birjand.ac.ir/api/v0/Credit", _neededCookies);
            HttpResponseMessage balanceResponse = await _httpClient.SendAsync(balanceRequest);         
            return balanceResponse.IsSuccessStatusCode ? await balanceResponse.Content.ReadAsStringAsync() : "-1";
        }

        #region Utilities
        private HttpRequestMessage ConfigHttpRequest(HttpMethod httpMethod, string url, Dictionary<string, string>? cookies = null, string content = "", string headerContentType = "", string referer = "")
        {
            HttpRequestMessage httpRequest = new HttpRequestMessage(httpMethod, url);

            if (cookies is not null && cookies.Count > 0)
            {
                StringBuilder cookiesStr = new StringBuilder("_ga=GA1.1.553082829.1714027468; FirstFoodCookie=isFirstFood=true; _ga_4QSMD23R5D=GS1.1.1728403222.270.0.1728403222.0.0.0; _ga_ZCVJJCYKM6=GS1.1.1728464746.151.0.1728464746.0.0.0;");
                foreach (var cookie in cookies)
                    cookiesStr.Append($"{cookie.Key}={cookie.Value}; ");
                cookiesStr.Remove(cookiesStr.Length - 2, 2);

                httpRequest.Headers.Add("cookie", cookiesStr.ToString());
            }

            if (!string.IsNullOrEmpty(content))
            {
                httpRequest.Content = new StringContent(content);
                httpRequest.Content.Headers.ContentType = new MediaTypeHeaderValue(headerContentType);
            }

            if (!string.IsNullOrEmpty(referer))
                httpRequest.Headers.Add("referer", referer);

            return httpRequest;
        }
        #endregion
    }
}
