using System;

namespace ZoomerApi.Models
{
    public class Meeting : BaseModel
    {
        public string Uuid { get; set; }

        public string Topic { get; set; }

        public MeetingTypes Type { get; set; }

        public DateTimeOffset StartTime { get; set; }

        public int Duration { get; set; }

        public string Timezone { get; set; }

        public string Password { get; set; }

        public string Agenda { get; set; }

        public string StartUrl { get; set; }

        public string JoinUrl { get; set; }

        public MeetingSettings Settings { get; set; }
    }
}
