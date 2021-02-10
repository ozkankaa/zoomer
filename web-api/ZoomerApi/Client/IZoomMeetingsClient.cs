using System.Collections.Generic;
using ZoomerApi.Models;

namespace ZoomerApi.Client
{
    public interface IZoomMeetingsClient
    {
        ListMeetings GetMeetings(string userId, MeetingListTypes type = MeetingListTypes.Live);

        Meeting CreateMeeting(string userId, Meeting meeting);

        Meeting GetMeeting(string meetingId);

        bool UpdateMeeting(string meetingId, Meeting meeting);

        bool DeleteMeeting(string meetingId);

        bool EndMeeting(string meetingId);

        ListMeetingRegistrants GetMeetingRegistrants(string meetingId, string status = "approved");

        MeetingRegistrant CreateMeetingRegistrant(string meetingId, CreateMeetingRegistrant meetingRegistrant);

        bool UpdateMeetingRegistrant(string meetingId, List<UpdateMeetingRegistrant> registrants, string status);
    }
}
