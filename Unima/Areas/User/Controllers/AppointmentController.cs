using Amazon.S3.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Unima.Areas.Faculty.Models.Appointment;
using Unima.Areas.User.Models.Appointment;
using Unima.Areas.User.Models.ViewModels;
using Unima.Biz.UoW;
using Unima.Dal.Entities;
using Unima.Dal.Entities.Entities;
using Unima.Dal.Enums;
using Unima.HelperClasses.ExtensionMethods;

namespace Unima.Areas.User.Controllers;

[Area("User")]
public class AppointmentController(IUnitOfWork _unitOfWork, UserManager<ApplicationUser> _userManager) : Controller
{
    public async Task<IActionResult> Index()
    {
        ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

        if (currentUser is null)
            return NotFound();

        bool isProfessor = User.IsInRole("Professor");

        IQueryable<AppointmentViewModel>? appointments = _unitOfWork.RepositoryBase<Appointment>()
                                                     .Include(appointment => isProfessor ? appointment.ProfessorId == currentUser.Id : appointment.UserId == currentUser.Id, appointment => appointment.Location)
                                                     .Include(appointment => appointment.User)
                                                     .Select(appointment => new AppointmentViewModel
                                                     {
                                                         Id = appointment.Id,
                                                         Topic = appointment.Topic,
                                                         Description = appointment.Description,
                                                         Date = appointment.ReservedDateTime.ConvertToShmasi(),
                                                         Time = appointment.ReservedDateTime.ToString("HH:mm"),
                                                         RequestSentOn = appointment.RequestSentOn.ConvertToShmasi(),
                                                         Duration = appointment.Duration,
                                                         IsStarred = appointment.IsStarred,
                                                         SenderUsername = appointment.User.UserName!,
                                                         SenderFullName = appointment.User.FullName,
                                                         LocationTitle = appointment.Location.Title,
                                                         Status = appointment.Status
                                                     });

        return View(appointments);
    }

    public async Task<IActionResult> Post(AppointmentModel appointmentModel)
    {
        //_unitOfWork.RepositoryBase
        return Ok();
    }

    [HttpPost("Appointment/StarUnstar/{id:int}")]
    public async Task<IActionResult> StarUnstar(int id)
    {
        Appointment? appointment = await _unitOfWork.RepositoryBase<Appointment>().FirstOrDefaultAsync(appointment => appointment.Id == id);

        if (appointment is null)
            return BadRequest();

        appointment.IsStarred = !appointment.IsStarred;

        await _unitOfWork.SaveAsync();
        return Ok();
    }

    [HttpPost("Appointment/AcceptOrReject/{id:int}")]
    public async Task<IActionResult> AcceptOrReject(int id,[FromBody] AccepRejectModel model)
    {
        Appointment? appointment = await _unitOfWork.RepositoryBase<Appointment>().FirstOrDefaultAsync(appointment => appointment.Id == id);

        if (appointment is null)
            return BadRequest();

        appointment.Status = model.Status;
        appointment.RejectionDescription = model.Description;

        await _unitOfWork.SaveAsync();
        return Ok();
    }
}
