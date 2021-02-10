using RestSharp;
using System.Collections.Generic;
using ZoomerApi.Extensions;
using ZoomerApi.Models;

namespace ZoomerApi.Client
{
    public class ZoomMeetingsClient : IZoomMeetingsClient
    {
        ZoomClientOptions Options { get; set; }
        RestClient WebClient { get; set; }

        internal ZoomMeetingsClient(ZoomClientOptions options, RestClient webClient)
        {
            Options = options;
            WebClient = webClient;
        }

        public ListMeetings GetMeetings(string userId, MeetingListTypes type = MeetingListTypes.Live)
        {
            var request = BuildRequestAuthorization("users/{userId}/meetings", Method.GET);
            request.AddParameter("userId", userId, ParameterType.UrlSegment);

            var response = WebClient.Execute<ListMeetings>(request);

            if (response.ResponseStatus == ResponseStatus.Completed && response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return response.Data;
            }
            return null;
        }

        public Meeting CreateMeeting(string userId, Meeting meeting)
        {
            var request = BuildRequestAuthorization("users/{userId}/meetings", Method.POST);
            request.AddParameter("userId", userId, ParameterType.UrlSegment);
            request.AddJsonBody(meeting);

            var response = WebClient.Execute<Meeting>(request);

            if (response.ResponseStatus == ResponseStatus.Completed && response.StatusCode == System.Net.HttpStatusCode.Created)
            {
                return response.Data;
            }

            return null;
        }

        public Meeting GetMeeting(string meetingId)
        {
            var request = BuildRequestAuthorization("meetings/{meetingId}", Method.GET);
            request.AddParameter("meetingId", meetingId, ParameterType.UrlSegment);

            var response = WebClient.Execute<Meeting>(request);

            if (response.ResponseStatus == ResponseStatus.Completed && response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return response.Data;
            }

            return null;
        }

        public bool UpdateMeeting(string meetingId, Meeting meeting)
        {
            var request = BuildRequestAuthorization("meetings/{meetingId}", Method.PATCH);
            request.AddParameter("meetingId", meetingId, ParameterType.UrlSegment);
            request.AddJsonBody(meeting);

            var response = WebClient.Execute(request);

            if (response.ResponseStatus == ResponseStatus.Completed && response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return true;
            }

            return false;
        }

        public bool DeleteMeeting(string meetingId)
        {
            var request = BuildRequestAuthorization("meetings/{meetingId}", Method.DELETE);
            request.AddParameter("meetingId", meetingId, ParameterType.UrlSegment);

            var response = WebClient.Execute(request);

            if (response.ResponseStatus == ResponseStatus.Completed && response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return true;
            }

            return false;
        }

        public bool EndMeeting(string meetingId)
        {
            var request = BuildRequestAuthorization("meetings/{meetingId}/status", Method.PUT);
            request.AddParameter("meetingId", meetingId, ParameterType.UrlSegment);
            request.AddJsonBody(new { action = "end" });

            var response = WebClient.Execute(request);

            if (response.ResponseStatus == ResponseStatus.Completed && response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return true;
            }

            return false;
        }

        public ListMeetingRegistrants GetMeetingRegistrants(string meetingId, string status = "approved")
        {
            var request = BuildRequestAuthorization("meetings/{meetingId}/registrants", Method.GET);
            request.AddParameter("meetingId", meetingId, ParameterType.UrlSegment);
            request.AddParameter("status", status, ParameterType.QueryString);

            var response = WebClient.Execute<ListMeetingRegistrants>(request);

            if (response.ResponseStatus == ResponseStatus.Completed && response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return response.Data;
            }

            return null;
        }

        public MeetingRegistrant CreateMeetingRegistrant(string meetingId, CreateMeetingRegistrant meetingRegistrant)
        {
            var request = BuildRequestAuthorization("meetings/{meetingId}/registrants", Method.POST);
            request.AddParameter("meetingId", meetingId, ParameterType.UrlSegment);

            request.AddJsonBody(meetingRegistrant);

            var response = WebClient.Execute<MeetingRegistrant>(request);

            if (response.ResponseStatus == ResponseStatus.Completed && response.StatusCode == System.Net.HttpStatusCode.Created)
            {
                return response.Data;
            }

            return null;
        }

        public bool UpdateMeetingRegistrant(string meetingId, List<UpdateMeetingRegistrant> registrants, string status)
        {
            var request = BuildRequestAuthorization("meetings/{meetingId}/registrants/status", Method.PUT);
            request.AddParameter("meetingId", meetingId, ParameterType.UrlSegment);

            request.AddJsonBody(new { action = status, registrants });

            var response = WebClient.Execute(request);

            if (response.ResponseStatus == ResponseStatus.Completed && response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return true;
            }

            return false;
        }

        RestRequest BuildRequestAuthorization(string resource, Method method)
        {
            return WebClient.BuildRequestAuthorization(Options, resource, method);
        }
    }
}
