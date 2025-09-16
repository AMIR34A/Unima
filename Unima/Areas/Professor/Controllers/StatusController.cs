//using Amazon.S3;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.CodeAnalysis.Options;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Options;
//using Unima.Areas.Professor.Models;
//using Unima.Areas.Professor.Models.Status;
//using Unima.Areas.Professor.Models.ViewModels;
//using Unima.Biz.UoW;
//using Unima.Dal.Entities.Entities;
//using Unima.Dal.Enums;
//using Unima.HelperClasses.Configurations;

//namespace Unima.Areas.Professor.Controllers;

//[Area("Professor")]
//public class StatusController : Controller
//{
//    private readonly IUnitOfWork _unitOfWork;
//    private readonly IAmazonS3 _s3Client;
//    private readonly AmazonS3Options _option;

//    public StatusController(IUnitOfWork unitOfWork, IAmazonS3 s3Client, IOptions<AmazonS3Options> option)
//    {
//        _unitOfWork = unitOfWork;
//        _s3Client = s3Client;
//        _option = option.Value;
//    }

//    public async Task<IActionResult> Index()
//    {
//        IEnumerable<OfficeModel>? leftOffices = (await _unitOfWork.RepositoryBase<ProfessorInformation>().GetAllAsync("User"))
//                                                .Where(professor => professor.Side == Side.Left)
//                                                .Select(professor => new OfficeModel()
//                                                {
//                                                    ProfessorFullName = professor.User.FullName,
//                                                    ProfilePhotoUrl = $"https://{_option.Bucket}.{new Uri(_s3Client.Config.ServiceURL).Host}/user.png",
//                                                    No = professor.OfficeNo,
//                                                    Status = professor.OfficeStatus switch
//                                                    {
//                                                        OfficeStatus.Unspecified => "در سامانه ثبت نشده است",
//                                                        OfficeStatus.Available => "حاضر",
//                                                        OfficeStatus.Busy => "مشغول",
//                                                        OfficeStatus.DoNotDisturb => "مزاحم نشوید",
//                                                        OfficeStatus.Offline => "حضور ندارد",
//                                                        _ => string.Empty
//                                                    },
//                                                    StatusStr = professor.OfficeStatus.ToString(),
//                                                    PhoneNumber = professor.PublicPhoneNumber
//                                                });

//        IEnumerable<OfficeModel>? rightOffices = (await _unitOfWork.RepositoryBase<ProfessorInformation>().GetAllAsync("User"))
//                                                 .Where(professor => professor.Side == Side.Right)
//                                                 .Select(professor => new OfficeModel()
//                                                 {
//                                                     ProfessorFullName = professor.User.FullName,
//                                                     ProfilePhotoUrl = $"https://{_option.Bucket}.{new Uri(_s3Client.Config.ServiceURL).Host}/user.png",
//                                                     No = professor.OfficeNo,
//                                                     Status = professor.OfficeStatus switch
//                                                     {
//                                                         OfficeStatus.Unspecified => "در سامانه ثبت نشده است",
//                                                         OfficeStatus.Available => "حاضر",
//                                                         OfficeStatus.Busy => "مشغول",
//                                                         OfficeStatus.DoNotDisturb => "مزاحم نشوید",
//                                                         OfficeStatus.Offline => "حضور ندارد",
//                                                         _ => string.Empty
//                                                     },
//                                                     StatusStr = professor.OfficeStatus.ToString(),
//                                                     PhoneNumber = professor.PublicPhoneNumber
//                                                 });

//        StatusViewModel statusViewModel = new StatusViewModel()
//        {
//            LeftOffices = leftOffices,
//            RightOffices = rightOffices
//        };

//        return View(statusViewModel);
//    }

//    [HttpGet]
//    [Route("Professor/Status/GetProfessorInformation/{officeNo:int}")]
//    public async Task<IActionResult> GetProfessorInformationAsync(int officeNo)
//    {
//        ProfessorInformation? professor = (await _unitOfWork.RepositoryBase<ProfessorInformation>()
//                                          .Include(professor => professor.User)
//                                          .Include(professor => professor.Lessons)
//                                          .ThenInclude(lesson => lesson.Schedules)
//                                          .FirstOrDefaultAsync(professor => professor.OfficeNo == officeNo));

//        if (professor is null)
//            return BadRequest();

//        WeekDay dayOfWeek = DateTime.Now.DayOfWeek switch
//        {
//            DayOfWeek.Saturday => WeekDay.Saturday,
//            DayOfWeek.Sunday => WeekDay.Sunday,
//            DayOfWeek.Monday => WeekDay.Monday,
//            DayOfWeek.Tuesday => WeekDay.Tuesday,
//            DayOfWeek.Wednesday => WeekDay.Wednesday,
//            DayOfWeek.Thursday => WeekDay.Thursday,
//            _ => WeekDay.Friday
//        };

//        bool isLoginned = User is not null && User.Identity is not null && User.Identity.IsAuthenticated;

//        IOrderedEnumerable<ScheduleModel>? schedules = professor.Lessons.SelectMany(lesson => lesson.Schedules)
//                                                                    .Where(schedule => isLoginned || schedule.DayOfWeek == dayOfWeek)
//                                                                    .Select(schedule => new ScheduleModel()
//                                                                    {
//                                                                        LessonTitle = schedule.Lesson.Title,
//                                                                        GroupNo = schedule.LessonGroupNo,
//                                                                        RoomNo = schedule.RoomNo,
//                                                                        DayOfWeek = schedule.DayOfWeek,
//                                                                        DayTitle = schedule.DayOfWeek switch
//                                                                        {
//                                                                            WeekDay.Saturday => "شنبه",
//                                                                            WeekDay.Sunday => "یکشنبه",
//                                                                            WeekDay.Monday => "دوشنبه",
//                                                                            WeekDay.Thursday => "سه‌شنبه",
//                                                                            WeekDay.Wednesday => "چهارشنبه",
//                                                                            WeekDay.Tuesday => "پنجشنبه",
//                                                                            WeekDay.Friday => "جمعه",
//                                                                            _ => string.Empty
//                                                                        },
//                                                                        WeekStatus = schedule.WeekStatus,
//                                                                        Period = schedule.Period
//                                                                    }).OrderBy(schedule => schedule.DayOfWeek);

//        return Ok(new
//        {
//            FullName = professor.User.FullName,
//            ProfilePhotoUrl = $"https://{_option.Bucket}.{new Uri(_s3Client.Config.ServiceURL).Host}/user.png",
//            Department = professor.Department,
//            Bio = professor.Biography,
//            Email = professor.User.Email,
//            Address = professor.Address,
//            Description = professor.Description,
//            Schedules = schedules
//        });
//    }
//}