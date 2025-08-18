using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Unima.Areas.Professor.Hubs;
using Unima.Areas.Professor.Models;
using Unima.Areas.Professor.Models.Status;
using Unima.Areas.Professor.Models.ViewModels;
using Unima.Biz.UoW;
using Unima.Dal.Entities.Entities;
using Unima.Dal.Enums;

namespace Unima.Areas.Professor.Controllers;

[Area("Professor")]
public class StatusController : Controller
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHubContext<StatusHub> _hubContext;

    public StatusController(IUnitOfWork unitOfWork, IHubContext<StatusHub> hubContext)
    {
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async Task<IActionResult> Index()
    {
        IEnumerable<OfficeModel>? leftOffices = (await _unitOfWork.RepositoryBase<ProfessorInformation>().GetAllAsync("User"))
                                                .Where(professor => professor.Side == Side.Left)
                                                .Select(professor => new OfficeModel()
                                                {
                                                    ProfessorFullName = professor.User.FullName,
                                                    ProfilePhotoUrl = Url.Action("GetProfilePhoto", new { officeNo = professor.OfficeNo }),
                                                    No = professor.OfficeNo,
                                                    Status = professor.OfficeStatus switch
                                                    {
                                                        OfficeStatus.Unspecified => "در سامانه ثبت نشده است",
                                                        OfficeStatus.Available => "حاضر",
                                                        OfficeStatus.Busy => "مشغول",
                                                        OfficeStatus.DoNotDisturb => "مزاحم نشوید",
                                                        OfficeStatus.Offline => "حضور ندارد",
                                                        _ => string.Empty
                                                    },
                                                    StatusStr = professor.OfficeStatus.ToString(),
                                                    PhoneNumber = professor.PublicPhoneNumber
                                                });

        IEnumerable<OfficeModel>? rightOffices = (await _unitOfWork.RepositoryBase<ProfessorInformation>().GetAllAsync("User"))
                                                 .Where(professor => professor.Side == Side.Right)
                                                 .Select(professor => new OfficeModel()
                                                 {
                                                     ProfessorFullName = professor.User.FullName,
                                                     ProfilePhotoUrl = Url.Action("GetProfilePhoto", new { officeNo = professor.OfficeNo }),
                                                     No = professor.OfficeNo,
                                                     Status = professor.OfficeStatus switch
                                                     {
                                                         OfficeStatus.Unspecified => "در سامانه ثبت نشده است",
                                                         OfficeStatus.Available => "حاضر",
                                                         OfficeStatus.Busy => "مشغول",
                                                         OfficeStatus.DoNotDisturb => "مزاحم نشوید",
                                                         OfficeStatus.Offline => "حضور ندارد",
                                                         _ => string.Empty
                                                     },
                                                     StatusStr = professor.OfficeStatus.ToString(),
                                                     PhoneNumber = professor.PublicPhoneNumber
                                                 });

        StatusViewModel statusViewModel = new StatusViewModel()
        {
            LeftOffices = leftOffices,
            RightOffices = rightOffices
        };

        return View(statusViewModel);
    }

    [Route("Professor/Status/UpdateStatus/{roomId:int}/{roomStatus:int}")]
    public async Task UpdateStatus(int roomId, OfficeStatus roomStatus)
    {
        await _hubContext.Clients.All.SendAsync("UpdateRoomStatus", roomId, roomStatus.ToString());
    }

    [HttpGet]
    [Route("Professor/Status/GetProfessorInformation/{officeNo:int}")]
    public async Task<IActionResult> GetProfessorInformationAsync(int officeNo)
    {
        ProfessorInformation? professor = (await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                          .Include(professor => professor.User)
                                          .Include(professor => professor.Lessons)
                                          .ThenInclude(lesson => lesson.Schedules)
                                          .FirstOrDefaultAsync(professor => professor.OfficeNo == officeNo));

        if (professor is null)
            return BadRequest();

        var schedules = professor.Lessons.SelectMany(lesson => lesson.Schedules)
                                                               .Select(schedule => new ScheduleModel()
                                                               {
                                                                   LessonTitle = schedule.Lesson.Title,
                                                                   GroupNo = schedule.LessonGroupNo,
                                                                   RoomNo = schedule.RoomNo,
                                                                   DayOfWeek = schedule.DayOfWeek,
                                                                   DayTitle = schedule.DayOfWeek switch
                                                                   {
                                                                       WeekDay.Saturday => "شنبه",
                                                                       WeekDay.Sunday => "یکشنبه",
                                                                       WeekDay.Monday => "دوشنبه",
                                                                       WeekDay.Thursday => "سه‌شنبه",
                                                                       WeekDay.Wednesday => "چهارشنبه",
                                                                       WeekDay.Tuesday => "پنجشنبه",
                                                                       WeekDay.Friday => "جمعه",
                                                                       _ => string.Empty
                                                                   },
                                                                   WeekStatus = schedule.WeekStatus,
                                                                   Period = schedule.Period
                                                               }).OrderBy(schedule => schedule.DayOfWeek);

        return Ok(new
        {
            FullName = professor.User.FullName,
            ProfilePhotoUrl = Url.Action("GetProfilePhoto", new { officeNo = professor.OfficeNo }),
            Department = professor.Department,
            Bio = professor.Biography,
            Email = professor.User.Email,
            Address = professor.Address,
            Description = professor.Description,
            Schedules = schedules
        });
    }

    [HttpGet("{officeNo:int}")]
    public async Task<IActionResult> GetProfilePhoto(int officeNo)
    {
        ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>()
            .FirstOrDefaultAsync(professor => professor.OfficeNo == officeNo);

        if (professor is null)
            return BadRequest();

        return File(professor.ProfilePhoto, "image/png");
    }
}