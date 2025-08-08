using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Unima.Areas.Professor.Hubs;
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
        ProfessorInformation? professor = (await _unitOfWork.RepositoryBase<ProfessorInformation>().GetAllAsync("User"))
                                          .FirstOrDefault(professor => professor.OfficeNo == officeNo);
        if (professor is null)
            return BadRequest();

        return Ok(new
        {
            FullName = professor.User.FullName,
            ProfilePhotoUrl = Url.Action("GetProfilePhoto", new { officeNo = professor.OfficeNo }),
            Department = professor.Department,
            Bio = professor.Biography,
            Email = professor.User.Email,
            Address = professor.Address,
            Description = professor.Description
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