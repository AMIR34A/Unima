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
        IEnumerable<RoomModel>? leftRooms = (await _unitOfWork.RepositoryBase<ProfessorInformation>().GetAllAsync("User"))
                                            .Where(professor => professor.Side == Side.Left)
                                            .Select(professor => new RoomModel()
                                            {
                                                ProfessorFullName = professor.User.FullName,
                                                No = professor.RoomNo,
                                                Status = professor.RoomStatus switch
                                                {
                                                    RoomStatus.Unspecified => "در سامانه ثبت نشده است",
                                                    RoomStatus.Available => "حاضر",
                                                    RoomStatus.Busy => "مشغول",
                                                    RoomStatus.DoNotDisturb => "مزاحم نشوید",
                                                    RoomStatus.Offline => "حضور ندارد",
                                                    _ => string.Empty
                                                },
                                                StatusStr = professor.RoomStatus.ToString(),
                                                PhoneNumber = professor.PublicPhoneNumber
                                            });

        IEnumerable<RoomModel>? rightRooms = (await _unitOfWork.RepositoryBase<ProfessorInformation>().GetAllAsync("User"))
                                             .Where(professor => professor.Side == Side.Right)
                                             .Select(professor => new RoomModel()
                                             {
                                                 ProfessorFullName = professor.User.FullName,
                                                 No = professor.RoomNo,
                                                 Status = professor.RoomStatus switch
                                                 {
                                                     RoomStatus.Unspecified => "در سامانه ثبت نشده است",
                                                     RoomStatus.Available => "حاضر",
                                                     RoomStatus.Busy => "مشغول",
                                                     RoomStatus.DoNotDisturb => "مزاحم نشوید",
                                                     RoomStatus.Offline => "حضور ندارد",
                                                     _ => string.Empty
                                                 },
                                                 StatusStr = professor.RoomStatus.ToString(),
                                                 PhoneNumber = professor.PublicPhoneNumber
                                             });

        StatusViewModel statusViewModel = new StatusViewModel()
        {
            LeftRooms = leftRooms,
            RightRooms = rightRooms
        };

        return View(statusViewModel);
    }

    [Route("Professor/Status/UpdateStatus/{roomId:int}/{roomStatus:int}")]
    public async Task UpdateStatus(int roomId, RoomStatus roomStatus)
    {
        await _hubContext.Clients.All.SendAsync("UpdateRoomStatus", roomId, roomStatus.ToString());
    }
}