using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System.Globalization;

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

    public static string FirstError(this ModelStateDictionary modelState)
    {
        string? errorMessage =  modelState.Values.SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .FirstOrDefault();

        return string.IsNullOrEmpty(errorMessage) ? "خطایی رخ داد؛ با پشتیبان سامانه ارتباط برقرار کنید." : errorMessage; 
    }
}

public static class ConvertDateToShamsiExtentions
{
    public static string ConvertToShmasi(this DateTime dateTime)
    {
        PersianCalendar persianCalendar = new PersianCalendar();
        int year = persianCalendar.GetYear(dateTime);
        int month = persianCalendar.GetMonth(dateTime);
        int day = persianCalendar.GetDayOfMonth(dateTime);

        return string.Format("{0}/{1}/{2}", year, month, day);
    }
}