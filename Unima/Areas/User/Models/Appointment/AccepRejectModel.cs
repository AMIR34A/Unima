using Microsoft.AspNetCore.Mvc.RazorPages;
using Unima.Dal.Enums;

namespace Unima.Areas.User.Models.Appointment
{
    public class AccepRejectModel
    {
        public string? Description { get; set; }

        public AppointmentStatus Status { get; set; }
    }
}