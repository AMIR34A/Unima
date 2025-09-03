namespace Unima.HelperClasses.Configurations;

public sealed class AmazonS3Options
{
    [ConfigurationKeyName("BUCKET_NAME")]
    public required string Bucket { get; set; }
}