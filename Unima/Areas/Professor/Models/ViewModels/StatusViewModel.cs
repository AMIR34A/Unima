using Unima.Areas.Professor.Models.Status;

namespace Unima.Areas.Professor.Models.ViewModels;

public class StatusViewModel
{
    public IEnumerable<RoomModel> LeftRooms { get; set; }

    public IEnumerable<RoomModel> RightRooms { get; set; }
}