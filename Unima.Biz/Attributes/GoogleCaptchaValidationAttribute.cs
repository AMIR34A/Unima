using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;

namespace Unima.Biz.Attributes;

public class GoogleCaptchaValidationAttribute : ValidationAttribute
{
    private readonly string _secretKey;

    public GoogleCaptchaValidationAttribute(string secretKey)
    {
        _secretKey = secretKey;
    }

    protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
    {
        Lazy<ValidationResult> validationResult = new Lazy<ValidationResult>(() => new ValidationResult("لطفا با زدن تیک من ربات نیستم هویت خود را تایید کنید.", new String[] { validationContext.MemberName }));
        if (value is null)
            return validationResult.Value;

        string reCaptchaResponse = value.ToString();

        using HttpClient httpClient = new HttpClient();
        var httpResponse = httpClient.GetAsync($"https://www.google.com/recaptcha/api/siteverify?secret={_secretKey}&response={reCaptchaResponse}").Result;
        if (!httpResponse.IsSuccessStatusCode)
            return validationResult.Value;
        var jesonResponseAsString = httpResponse.Content.ReadAsStringAsync().Result;
        var jsonData = JObject.Parse(jesonResponseAsString);
        if (jsonData.Value<bool>("success") != true)
            return validationResult.Value;
        return ValidationResult.Success;
    }
}
