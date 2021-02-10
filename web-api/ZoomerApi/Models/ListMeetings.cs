using System.Collections.Generic;

namespace ZoomerApi.Models
{
    public class ListMeetings : BaseListModel
    {
        public List<Meeting> Meetings { get; set; }
    }
}
