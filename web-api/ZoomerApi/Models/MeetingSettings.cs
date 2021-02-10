using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ZoomerApi.Models
{
    public class MeetingSettings
    {
        [JsonProperty("host_video")]
        public bool EnableHostVideo { get; set; }

        [JsonProperty("participant_video")]
        public bool EnableParticipantVideo { get; set; }

        [JsonProperty("join_before_host")]
        public bool EnableJoinBeforeHost { get; set; }

        public MeetingApprovalTypes ApprovalType { get; set; }

        public string AutoRecording { get; set; }

        [JsonProperty("enforce_login")]
        public bool EnableEnforceLogin { get; set; }
    }
}
