using Amazon.S3;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Unima.Areas.Faculty.Models;
using Unima.Areas.Faculty.Models.ViewModels;
using Unima.Areas.Professor.Models;
using Unima.Areas.User.Models.Profile;
using Unima.Biz.UoW;
using Unima.Dal.Entities.Entities;
using Unima.Dal.Enums;
using Unima.HelperClasses.Configurations;

namespace Unima.Areas.Faculty.Controllers;

[Area("Faculty")]
public class ProfessorsController(IUnitOfWork _unitOfWork, IAmazonS3 _s3Client, IOptions<AmazonS3Options> _options) : Controller
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
    [Route("Professor/Status/GetProfessorData/{professorId:int}")]
    public async Task<IActionResult> GetProfessorData(int professorId)
    {
        ProfessorInformation? professor = (await _unitOfWork.RepositoryBase<ProfessorInformation>()
                                          .Include(professor => professor.Lessons)
                                          .ThenInclude(lesson => lesson.Schedules)
                                          .FirstOrDefaultAsync(professor => professor.Id == professorId));

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
}