using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace Unima.Biz.Attributes;

public class GoogleCaptchaValidationAttribute : ValidationAttribute
{
    private const string _errorMessage = "خطا در بررسی اعتبارسنجی reCAPTCHA.";
    private const float _scoreThreshold = 0.4f;

    protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
    {
        if (value is null)
            return new ValidationResult(_errorMessage);

        string? token = value.ToString();

        IConfiguration configuration = (IConfiguration)validationContext.GetService(typeof(IConfiguration));
        string secretKey = configuration.GetValue<string>("GoogleCaptcha:SecretKey");

        try
        {
            var result = Task.Run(() => ValidateCaptcha(token, secretKey)).Result;
            return result;
        }
        catch (Exception)
        {
            return new ValidationResult(_errorMessage);
        }
    }

    private async Task<ValidationResult> ValidateCaptcha(string token, string secretKey)
    {
        using HttpClient httpClient = new HttpClient();
        HttpResponseMessage response = await httpClient.PostAsync($"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={token}", null);
        string jsonResponse = await response.Content.ReadAsStringAsync();
        CaptchaResponse? captchaResult = JsonSerializer.Deserialize<CaptchaResponse>(jsonResponse);

        return captchaResult is not null && captchaResult.success && captchaResult.score >= _scoreThreshold
            ? ValidationResult.Success
            : new ValidationResult(_errorMessage);
    }
}

public class CaptchaResponse
{
    public bool success { get; set; }
    public float score { get; set; }
    public string action { get; set; }
}
