using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace Unima.HelperClasses.ExtensionMethods;

public static class ViewDataExtensions
{
    public static void SetError(this ViewDataDictionary viewData, ModelStateDictionary modelState, string key, string? errorMessage = null)
    {
        string? firstError = string.IsNullOrEmpty(errorMessage) ? modelState.Values
                            .SelectMany(v => v.Errors)
                            .Select(e => e.ErrorMessage)
                            .FirstOrDefault() : errorMessage;

        viewData[key] = firstError;
    }
}
