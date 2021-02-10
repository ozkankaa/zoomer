using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using ZoomerApi.Client;
using ZoomerApi.Models;

namespace ZoomerApi.Controllers
{
    [ApiController]
    [Route("api/v1/meetings")]
    public class MeetingController : ControllerBase
    {
        private readonly ILogger<MeetingController> _logger;
        private readonly ZoomConfig _zoomConfig = new ZoomConfig();

        public MeetingController(ILogger<MeetingController> logger, IConfiguration configuration)
        {
            _logger = logger;
            configuration.GetSection("ZoomConfig").Bind(_zoomConfig);
        }

        [HttpGet]
        public ListMeetings GetMeetings(string ownerEmail)
        {
            var zoomClient = new ZoomClient(new ZoomClientOptions
            {
                ZoomApiKey = _zoomConfig.ApiKey,
                ZoomApiSecret = _zoomConfig.ApiSecret
            });

            return zoomClient.Meetings.GetMeetings(ownerEmail);
        }

        [HttpPost]
        public Meeting CreateMeeting(string ownerEmail, string meetingTopic)
        {
            var zoomClient = new ZoomClient(new ZoomClientOptions
            {
                ZoomApiKey = _zoomConfig.ApiKey,
                ZoomApiSecret = _zoomConfig.ApiSecret
            });

            var meeting = GenerateMeeting(meetingTopic);

            return zoomClient.Meetings.CreateMeeting(ownerEmail, meeting);
        }

        [HttpPatch]
        [Route("{meetingId}")]
        public bool UpdateMeeting([FromRoute] string meetingId, [FromBody] Meeting meeting)
        {
            var zoomClient = new ZoomClient(new ZoomClientOptions
            {
                ZoomApiKey = _zoomConfig.ApiKey,
                ZoomApiSecret = _zoomConfig.ApiSecret
            });

            return zoomClient.Meetings.UpdateMeeting(meetingId, meeting);
        }

        [HttpDelete]
        [Route("{meetingId}")]
        public bool DeleteMeeting([FromRoute] string meetingId)
        {
            var zoomClient = new ZoomClient(new ZoomClientOptions
            {
                ZoomApiKey = _zoomConfig.ApiKey,
                ZoomApiSecret = _zoomConfig.ApiSecret
            });

            return zoomClient.Meetings.DeleteMeeting(meetingId);
        }

        [HttpPut]
        [Route("{meetingId}")]
        public bool EndMeeting([FromRoute] string meetingId)
        {
            var zoomClient = new ZoomClient(new ZoomClientOptions
            {
                ZoomApiKey = _zoomConfig.ApiKey,
                ZoomApiSecret = _zoomConfig.ApiSecret
            });

            return zoomClient.Meetings.EndMeeting(meetingId);
        }

        [HttpGet]
        [Route("{meetingId}/registrants")]
        public ListMeetingRegistrants GetMeetingRegistrants([FromRoute]string meetingId)
        {
            var zoomClient = new ZoomClient(new ZoomClientOptions
            {
                ZoomApiKey = _zoomConfig.ApiKey,
                ZoomApiSecret = _zoomConfig.ApiSecret
            });

            return zoomClient.Meetings.GetMeetingRegistrants(meetingId);
        }

        [HttpPost]
        [Route("{meetingId}/registrants")]
        public MeetingRegistrant CreateMeetingRegistrants([FromRoute]string meetingId, string email, string firstName, string lastName)
        {
            var zoomClient = new ZoomClient(new ZoomClientOptions
            {
                ZoomApiKey = _zoomConfig.ApiKey,
                ZoomApiSecret = _zoomConfig.ApiSecret
            });

            var result = zoomClient.Meetings.CreateMeetingRegistrant(meetingId, new CreateMeetingRegistrant
            {
                Email = email,
                FirstName = firstName,
                LastName = lastName
            });

            return result;
        }

        Meeting GenerateMeeting(string topic, string password = null)
        {
            return new Meeting
            {
                Duration = 60,
                Password = password,
                Settings = new MeetingSettings
                {
                    EnableHostVideo = true,
                    EnableParticipantVideo = true,
                    EnableJoinBeforeHost = false,
                    ApprovalType = MeetingApprovalTypes.Automatic,
                    AutoRecording = MeetingAutoRecordingOptions.Cloud,
                    EnableEnforceLogin = true
                },
                StartTime = DateTimeOffset.Now,
                Topic = topic,
                Type = MeetingTypes.Scheduled,
            };
        }
    }
}
