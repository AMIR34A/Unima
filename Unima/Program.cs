using Amazon.Runtime;
using Amazon.S3;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using Unima.Areas.Faculty.Hubs;
using Unima.Areas.Professor.Hubs;
using Unima.Biz.UoW;
using Unima.Dal.Entities;
using Unima.Dal.Entities.Identity.User;
using Unima.Dal.Identity.Context;
using Unima.HelperClasses;
using Unima.HelperClasses.Configurations;
using Unima.HelperClasses.ExtensionMethods;
using Unima.HelperClasses.SelfService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

//builder.Services.AddDbContext<UnimaDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<UnimaIdentityDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
{
    options.Tokens.ChangePhoneNumberTokenProvider = TokenOptions.DefaultPhoneProvider;
}).AddEntityFrameworkStores<UnimaIdentityDbContext>()
    .AddDefaultTokenProviders()
    .AddErrorDescriber<ApplicationIdentityErrorDescriber>();

builder.Services.AddAuthentication();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequiredUniqueChars = 0;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireDigit = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;

    options.User.AllowedUserNameCharacters = "1234567890";
    options.User.RequireUniqueEmail = false;

    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    options.SignIn.RequireConfirmedPhoneNumber = true;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.AccessDeniedPath = "/Identity/Account/AccessDenied";
    options.Cookie.Name = "Unima";
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
});

builder.Services.AddTransient<IUnitOfWork, UnitOfWork>();
builder.Services.AddTransient<UnimaIdentityDbContext>();
builder.Services.AddHttpClient<ISelfServiceBuilder, SelfServiceBuilder>()
    .ConfigurePrimaryHttpMessageHandler(() =>
    {
        var clientHandler = new HttpClientHandler
        {
            UseCookies = true,
            CookieContainer = new CookieContainer()
        };
        clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };
        return clientHandler;
    });
builder.Services.AddTransient<ISelfServiceBuilder, SelfServiceBuilder>();
builder.Services.AddSingleton<IAmazonS3>(options =>
{
    var config = new AmazonS3Config
    {
        ServiceURL = builder.Configuration["LIARA_ENDPOINT_URL"],
        ForcePathStyle = true
    };

    var credentials = new BasicAWSCredentials(
        builder.Configuration["LIARA_ACCESS_KEY"],
        builder.Configuration["LIARA_SECRET_KEY"]
    );

    return new AmazonS3Client(credentials, config);
});

builder.Services.Configure<AmazonS3Options>(options =>
{
    options.Bucket = builder.Configuration["BUCKET_NAME"]!;
});

builder.Services.ConfigSmsNotification();
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.MapAreaControllerRoute(
    name: "UserArea",
    areaName: "User",
    pattern: "User/{controller}/{action=Index}/{id?}");

app.MapAreaControllerRoute(
    name: "ProfessorArea",
    areaName: "Professor",
    pattern: "Professor/{controller}/{action=Index}/{id?}");

app.MapAreaControllerRoute(
    name: "FacultyArea",
    areaName: "Faculty",
    pattern: "Faculty/{controller}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Index}/{id?}");

app.MapHub<ProfessorHub>("/ProfessorHub");

app.Run();
