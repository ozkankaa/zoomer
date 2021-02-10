using System;

namespace ZoomerApi.Models
{
    public class MeetingRegistrant : BaseModel
    {
        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Status { get; set; }

        public DateTime CreateTime { get; set; }

        public string JoinUrl { get; set; }
    }
}
