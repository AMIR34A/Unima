using Amazon.S3;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Unima.Areas.Faculty.Models;
using Unima.Areas.Faculty.Models.Appointment;
using Unima.Areas.Faculty.Models.ViewModels;
using Unima.Areas.Professor.Models;
using Unima.Areas.User.Models.Profile;
using Unima.Biz.UoW;
using Unima.Dal.Entities;
using Unima.Dal.Entities.Entities;
using Unima.Dal.Enums;
using Unima.HelperClasses.Configurations;
using Unima.HelperClasses.ExtensionMethods;

namespace Unima.Areas.Faculty.Controllers;

[Area("Faculty")]
public class ProfessorsController(IUnitOfWork _unitOfWork, UserManager<ApplicationUser> _userManager, IAmazonS3 _s3Client, IOptions<AmazonS3Options> _options) : Controller
{
    public IActionResult Index()
    {
        Dictionary<string, IEnumerable<ProfessorModel>>? professors = _unitOfWork.RepositoryBase<ProfessorInformation>()
                                                            .Include(professor => professor.User)
                                                            .Include(professor => professor.Lessons)
                                                            .Include(professor => professor.Department)
                                                            .ThenInclude(department => department.Faculty)
                                                            .AsNoTracking()
                                                            .AsEnumerable()
                                                            .Select(professor => new ProfessorModel()
                                                            {
                                                                Id = professor.Id,
                                                                FullName = professor.User.FullName,
                                                                ProfileImageURL = $"https://{_options.Value.Bucket}.{new Uri(_s3Client.Config.ServiceURL).Host}/user.png",
                                                                Faculty = professor.Department.Faculty.Title,
                                                                Department = professor.Department.Title,
                                                                Role = professor.Role,
                                                                Degree = professor.Degree,
                                                                Bio = professor.Biography,
                                                                Lessons = professor.Lessons.Select(lesson => lesson.Title),
                                                                Email = professor.User.Email,
                                                                PublicPhoneNumber = professor.PublicPhoneNumber,
                                                                OfficeAddess = professor.Description,
                                                                OfficeNo = professor.OfficeNo
                                                            }).GroupBy(professor => professor.Department, selector => selector)
                                                            .ToDictionary(selector => selector.Key, selector => selector.AsEnumerable());

        ProfessorViewModel professorViewModel = new()
        {
            Professors = professors
        };

        return View(professorViewModel);
    }

    [HttpGet]
    [Route("Faculty/Professor/GetData/{professorId:int}")]
    public async Task<IActionResult> GetData(int professorId)
    {
        ProfessorInformation? professor = (await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                          .Include(professor => professor.Id == professorId, professor => professor.Lessons)
                                          .ThenInclude(lesson => lesson.Schedules)
                                          .FirstOrDefaultAsync());

        if (professor is null)
            return BadRequest();

        WeekDay dayOfWeek = DateTime.Now.DayOfWeek switch
        {
            DayOfWeek.Saturday => WeekDay.Saturday,
            DayOfWeek.Sunday => WeekDay.Sunday,
            DayOfWeek.Monday => WeekDay.Monday,
            DayOfWeek.Tuesday => WeekDay.Tuesday,
            DayOfWeek.Wednesday => WeekDay.Wednesday,
            DayOfWeek.Thursday => WeekDay.Thursday,
            _ => WeekDay.Friday
        };


        bool isLoginned = User is not null && User.Identity is not null && User.Identity.IsAuthenticated;

        IOrderedEnumerable<Professor.Models.ScheduleModel>? schedules = professor.Lessons.SelectMany(lesson => lesson.Schedules)
                                                                    .Where(schedule => isLoginned || schedule.DayOfWeek == dayOfWeek)
                                                                    .Select(schedule => new Professor.Models.ScheduleModel()
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

        IEnumerable<LocationModel>? locations = (await _unitOfWork.RepositoryBase<Location>().GetAllAsync(location => location.ProfessorId == professorId))
                                                .Select(location => new LocationModel()
                                                {
                                                    Id = location.Id,
                                                    Title = location.Title,
                                                    Address = location.Address,
                                                    GoogleMapLink = location.GoogleMapLink
                                                });

        return Ok(new
        {
            Schedules = schedules,
            Locations = locations
        });
    }

    [HttpPost]
    public async Task<IActionResult> SetAppointment([FromBody] AppointmentModel appointmentModel)
    {
        ApplicationUser? currentUser = await _userManager.GetUserAsync(User);

        if (currentUser is null)
            return NotFound();

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        ProfessorInformation? professor = await _unitOfWork.RepositoryBase<ProfessorInformation>().FirstOrDefaultAsync(professor => professor.Id == appointmentModel.ProfessorId);

        if (professor is null)
            return NotFound();

        Location? location = await _unitOfWork.RepositoryBase<Location>().FirstOrDefaultAsync(location => location.Id == appointmentModel.LocationId);

        if (location is null)
            return NotFound();

        Appointment appointment = new Appointment
        {
            ProfessorId = professor.Id,
            Topic = appointmentModel.Topic,
            LocationId = location.Id,
            Description = appointmentModel.Description,
            ReservedDateTime = appointmentModel.ReservedDateTime,
            Duration = appointmentModel.Duration,
            RequestSentOn = DateTime.Now,
            IsStarred = false,
            UserId = currentUser.Id,
            Status = AppointmentStatus.Waiting
        };

        await _unitOfWork.RepositoryBase<Appointment>().AddAsync(appointment);

        await _unitOfWork.SaveAsync();
        return Ok();
    }
}