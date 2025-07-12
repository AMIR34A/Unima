namespace Unima.Models.Api;

public class ApiResult
{
    public bool IsSuccess { get; set; }

    public StatusCode StatusCode { get; set; }

    public string? Message { get; set; }

    public ApiResult(bool isSuccess, StatusCode statusCode, string message)
    {
        IsSuccess = isSuccess;
        StatusCode = statusCode;
        Message = message;
    }
}

public class ApiResult<T> : ApiResult
{
    public T Data { get; set; }

    public ApiResult(bool isSuccess, StatusCode statusCode, string message, T data) : base(isSuccess, statusCode, message)
    {
        Data = data;
    }
}

public enum StatusCode
{
    OK = 200,
    BadRequest = 400,
    Unauthorized = 401,
    NotFound = 404,
    InternalServerError = 500
}