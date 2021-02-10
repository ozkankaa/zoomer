using System.Collections.Generic;

namespace ZoomerApi.Models
{
    public class ListMeetingRegistrants : BaseListModel
    {
        public List<MeetingRegistrant> Registrants { get; set; }
    }
}
